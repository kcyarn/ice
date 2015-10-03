(function() {

var exports = this, IceCommentsPlugin;

IceCommentsPlugin = function(ice_instance) {
  this._ice = ice_instance;
  this.textHighlighted = function() {};
  ice_instance.addChangeType('highlightType', 'mark', 'mark', 'Highlighted');
  ice_instance.addChangeType('commentType', 'comment', 'comment', 'Commented');

ice.InlineChangeEditor.prototype.highlight = this._bind(this.highlight);
ice.InlineChangeEditor.prototype.comment = this._bind(this.comment);
ice.InlineChangeEditor.prototype.rejectComment = this._bind(this.rejectComment);
ice.InlineChangeEditor.prototype.rejectHighlight = this._bind(this.rejectHighlight);
ice.InlineChangeEditor.prototype.rejectAllHighlights = this._bind(this.rejectAllHighlights);
ice.InlineChangeEditor.prototype.rejectAllCommentsHighlights = this._bind(this.rejectAllCommentsHighlights);
};

IceCommentsPlugin.prototype = {

  highlight: function (node, range) {
    range = this._ice.getCurrentRange();
    var changeid = this._ice.startBatchChange();
    var node = this._ice.createIceNode('highlightType', node);
    this._ice.endBatchChange(changeid);
    node.appendChild(range.extractContents());
    this._highlightSelection(range);
    range.insertNode(node);
    this._ice.pluginsManager.fireNodeCreated(node, range);
    return true;

  },

  _highlightSelection: function (range) {

    // Bookmark the range and get elements between.
    var bookmark = new ice.Bookmark(this._ice.env, range),
      elements = ice.dom.getElementsBetween(bookmark.start, bookmark.end),
      b1 = ice.dom.parents(range.startContainer, this._ice.blockEls.join(', '))[0],
      b2 = ice.dom.parents(range.endContainer, this._ice.blockEls.join(', '))[0],
      betweenBlocks = new Array();

    for (var i = 0; i < elements.length; i++) {
      var elem = elements[i];
      if (ice.dom.isBlockElement(elem)) {
        betweenBlocks.push(elem);
        if (!ice.dom.canContainTextElement(elem)) {
          // Ignore containers that are not supposed to contain text. Check children instead.
          for (var k = 0; k < elem.childNodes.length; k++) {
            elements.push(elem.childNodes[k]);
          }
          continue;
        }
      }

      if (!this._getHighlightElement(elem)) {
        // If the element is not a text or stub node, go deeper and check the children.
        if (elem.nodeType !== ice.dom.TEXT_NODE) {
          // Browsers like to insert breaks into empty paragraphs - remove them
          if (ice.dom.BREAK_ELEMENT == ice.dom.getTagName(elem)) {
            continue;
          }

          if (ice.dom.isStubElement(elem)) {
            this._ice._addNodeTracking(elem, false, true);
            continue;
          }
          if (ice.dom.hasNoTextOrStubContent(elem)) {
            ice.dom.remove(elem);
          }

          for (j = 0; j < elem.childNodes.length; j++) {
            var child = elem.childNodes[j];
            elements.push(child);
          }
          continue;
        }
        var parentBlock = ice.dom.getBlockParent(elem);

        this._ice._addNodeTracking(elem, false, true, true);
        if (ice.dom.hasNoTextOrStubContent(parentBlock)) {
          ice.dom.remove(parentBlock);
        }
      }
    }

    if (this.mergeBlocks && b1 !== b2) {
      while (betweenBlocks.length)
        ice.dom.mergeContainers(betweenBlocks.shift(), b1);
      ice.dom.removeBRFromChild(b2);
      ice.dom.removeBRFromChild(b1);
      ice.dom.mergeContainers(b2, b1);
    }



    bookmark.selectBookmark();
  //      range.collapse(false);
  range.collapse(true);
  },

  _getHighlightElement: function (node) {
    var highlightSelector = this._getHighlightSelector();
    return ice.dom.is(node, highlightSelector) ? node : (ice.dom.parents(node, highlightSelector)[0] || null);
  },

  _getHighlightSelector: function () {
    return '.' + this._ice._getIceNodeClass('highlightType') + ',' + this.avoid;
  },

  comment: function (node, range) {
    range = this._ice.getCurrentRange();
    var changeid = this._ice.startBatchChange();
    var node = this._ice.createIceNode('commentType', node);
    //Using a unicode space solves the invisible comment!
    node.appendChild(document.createTextNode('\u00A0'));
    this._ice.endBatchChange(changeid);
    node.appendChild(range.extractContents());
    this._highlightSelection(range);
    range.insertNode(node);
    this._ice.pluginsManager.fireNodeInserted(node, range);
    return true;

  },

  acceptRejectComments: function (node, isAccept) {
    var highlightSel, commentSel, selector, removeSel, replaceSel, trackNode, changes;

    if (!node) {
      var range = this._ice.getCurrentRange();
      if (!range.collapsed) return;
      else node = range.startContainer;
    }

    highlightSel = removeSel = '.' + this._ice._getIceNodeClass('highlightType');
    commentSel = replaceSel = '.' + this._ice._getIceNodeClass('commentType');
    selector = highlightSel + ',' + commentSel;
    trackNode = ice.dom.getNode(node, selector);
    // Some changes are done in batches so there may be other tracking
    // nodes with the same `timeAttribute` batch number. Changed from changeIdAttribute.
    changes = ice.dom.find(this._ice.element, '[' + this._ice.timeAttribute + '=' + ice.dom.attr(trackNode, this._ice.timeAttribute) + ']');

    if (!isAccept) {
      removeSel = commentSel;
      replaceSel = highlightSel;
    }

    if (ice.dom.is(trackNode, replaceSel)) {
      ice.dom.each(changes, function (i, node) {
        ice.dom.replaceWith(node, ice.dom.contents(node));
      });
    } else if (ice.dom.is(trackNode, removeSel)) {
      ice.dom.remove(changes);
    }
  },

rejectComment: function(node) {
this.acceptRejectComments(node, false);
},
rejectHighlight: function(node) {
this.acceptRejectComments(node, false);
},

rejectAllHighlights: function() {
var highlightSel = '.' + this._ice._getIceNodeClass('highlightType');
ice.dom.each(ice.dom.find(this._ice.element, highlightSel), function (i, el) {
  ice.dom.replaceWith(el, ice.dom.contents(el));
});
},
rejectAllCommentsHighlights: function() {
  var commentSel = '.' + this._ice._getIceNodeClass('commentType'); //insert
  var highlightSel = '.' + this._ice._getIceNodeClass('highlightType'); // delete

  ice.dom.remove(ice.dom.find(this._ice.element, commentSel));
  ice.dom.each(ice.dom.find(this._ice.element, highlightSel), function (i, el) {
    ice.dom.replaceWith(el, ice.dom.contents(el));
  });
},

  _bind: function(method) {
  var self = this;
  return function() {
    return method.apply(self, arguments);
  }
}

};

ice.dom.noInclusionInherits(IceCommentsPlugin, ice.IcePlugin);
exports._plugin.IceCommentsPlugin = IceCommentsPlugin;

}).call(this.ice);
