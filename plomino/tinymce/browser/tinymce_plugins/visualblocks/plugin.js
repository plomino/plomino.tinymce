/**
 * plugin.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2015 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */

(function() {
	tinymce.create('tinymce.plugins.VisualBlocks', {

		init : function(ed, url) {

			var toggleActiveState = this.toggleActiveState;

			ed.addButton('mceVisualBlocks', {
				title : "Show/Hide VisualBlocks",
				onclick : function() { toggleActiveState(ed, url); },
				image : url + '/img/icon.png'
			});
		},

		toggleActiveState : function(ed, url) {
			var doc = ed.getDoc();
			var body = doc.body;

			// Add the visualblocks class to the TinyMCE body
			if (tinymce.DOM.hasClass(body, 'mce-visualblocks')) {
				body.className = body.className.replace('mce-visualblocks', '');
				ed.controlManager.setActive('mceVisualBlocks', false);
			} else {
				body.className = body.className + ' mce-visualblocks';
				ed.controlManager.setActive('mceVisualBlocks', true);
			};

			// Add the CSS to the dom, if needed
			if (doc.getElementById('visualblocks') == null) {
				var link = doc.createElement('link');
				link.rel = 'stylesheet';
				link.id = 'visualblocks';
				link.type = 'text/css';
				link.href = url + '/css/visualblocks.css';
				doc.head.appendChild(link);
			}
		},

		getInfo : function() {
			return {
				longname : 'VisualBlocks',
				author : '',
				authorurl : '',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('visualblocks', tinymce.plugins.VisualBlocks);
})();
