(function() {

var exports = this, IceCriticMarkupPlugin;
IceCriticMarkupPlugin = function(ice_instance) {
  this._ice = ice_instance;
  this.isCriticMarkup = false;
  ice.InlineChangeEditor.prototype.disableCriticMarkup = this._bind(this.disableCriticMarkup);
  ice.InlineChangeEditor.prototype.enableCriticMarkup = this._bind(this.enableCriticMarkup);
};

IceCriticMarkupPlugin.prototype = {
  nodeCreated: function(node, option) {
    var checkCriticMarkup = this.isCriticMarkup;
    if(checkCriticMarkup) {
    ice.dom.addClass(node, 'critic-markup');
  }
  },
  
addCriticMarkup: function() {
  var body = '';
  var classList = '';
  var self = this;
  var checkCriticMarkup = this.isCriticMarkup;

  ice.dom.each(this._ice.changeTypes, function (type, i) {
      classList = '.' + self._ice._getIceNodeClass(type);
      for (var i = 0; i < classList.length; i++) {
        ice.dom.addClass(classList, 'critic-markup');
      }
  });

  console.log(checkCriticMarkup);
},
removeCriticMarkup: function() {
  var body = '';
  var classList = '';
  var self = this;
  var checkCriticMarkup = this.isCriticMarkup;

  ice.dom.each(this._ice.changeTypes, function (type, i) {
      classList = '.' + self._ice._getIceNodeClass(type);
      for (var i = 0; i < classList.length; i++) {
        ice.dom.removeClass(classList, 'critic-markup');
      }
  });

  console.log(checkCriticMarkup);
},


  disableCriticMarkup: function () {
    this.isCriticMarkup = false;
    this.removeCriticMarkup();
    this._ice.pluginsManager.fireDisabled(this.element);
  },

  enableCriticMarkup: function () {
    this.isCriticMarkup = true;
    this.addCriticMarkup();
    this._ice.pluginsManager.fireEnabled(this.element);
  },
  _bind: function(method) {
  var self = this;
  return function() {
    return method.apply(self, arguments);
  }
}
};

ice.dom.noInclusionInherits(IceCriticMarkupPlugin, ice.IcePlugin);
exports._plugin.IceCriticMarkupPlugin = IceCriticMarkupPlugin;

}).call(this.ice);
