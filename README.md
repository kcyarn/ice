# ice.js

Ice is a track changes implementation, built in javascript, for anything that is `contenteditable` on the web. Conceived by the CMS Group at The New York Times, ice is powering the editor used for writing articles in the newsroom.

This version of ICE uses JQuery 2.1.4, which only supports IE 8+. It also removes *all* browser detection, updates rangy from 1.2.3 to 1.3.0, and utilizes ins, del, mark, and a custom tag called comment in place of spans. It is untested in all browsers other than Chrome!

## Demo

[Try original](http://NYTimes.github.com/ice/demo/)
[Try this](http://kcyarn/github.com/ice/demo/)

## Download

[v0.5.0](http://nytimes.github.com/ice/downloads/ice_0.5.0.zip) The original ICE

## Features

- Track multi-user inserts and deletes with the option to turn on and off tracking or highlighting.
- A robust API to accept and reject changes, get clean content, and add a lot of configuration.
- ~~Plugins for tinymce and wordpress.~~
- Optional plugins to track copy-cut-pasting, ~~convert smart quotes,~~add highlights and comments, and create em-dashes.

## Get Started
Please refer to the original ice http://NYTimes.github.com/ice. This fork is being developed for a nw.js application. Although the comment and critic markup plugins should work

## Limitations/Dependencies

- ice needs to be initialized after the DOM ready event fires.
- Wordpress support is limited. We need contribution from any willing WordPress developers.
- Browser support is limited to Firefox (5+) and Webkit browsers, and minimal support for IE8+.

## Changelog
### Customized
- JQuery 2.1.4. No JQuery-migrate required.
- Rangy 1.3.0
- ins tag replaced span class='ins'
- del tag replaced span class='del'
- Comments Plugin to highlight text and add a comment immediately after highlight.
- CriticMarkup Plugin to fake CriticMarkup appearance using css. See demo/demo.css .critic-markup for further information.
- Remove browser detection.
- Substituted email address for user id. The NW.js app's end goal is to take a multi-chapter document created within the app, pass it around between twenty people through both git and email, and always be able to tell who made change when. Since the app may or may not have web access, the email address becomes the unique identifier instead of an automatically generated id that may or may not be unique depending on whether the app had web access at the time it was installed.

### Master

- Fixes bug where Webkit browsers were throwing errors when the letter "v" was pressed.

### 0.5.0

- Fixes cut, copy, paste for Firefox and Webkit browsers.
- Fixes delete tracking in webkit browsers.

## License

[GPL 2.0](https://github.com/NYTimes/ice/blob/master/LICENSE)
