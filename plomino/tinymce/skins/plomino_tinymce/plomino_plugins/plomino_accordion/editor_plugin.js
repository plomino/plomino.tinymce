(function() {
	// Load plugin specific language pack
	//tinymce.PluginManager.requireLangPack('plomino_accordion');

	tinymce.create('tinymce.plugins.PlominoAccordion', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			ed.addCommand('mcePlominoAccordion', function() {
				// Remove the section
				if (ed.selection.isCollapsed()) {
					var accordion = tinymce.DOM.getParent(ed.selection.getNode(), "div.plomino-accordion-content");
					if (accordion != null) {
						// Find the section header
						var title = accordion.previousSibling;
						// can be an empty text node
						if (title.nodeType == 3)
							title = title.previousSibling;
						// Remove the header and unwrap the content
						if (tinymce.DOM.hasClass(title, "plomino-accordion-header"))
							tinymce.DOM.remove(title, false);
						tinymce.DOM.remove(accordion, true);
					}
				}
				// Add a section
				else {
					ed.windowManager.open({
						file : url + '/add_accordion.htm',
						width : 320 + ed.getLang('plomino_accordion.delta_width', 0),
						height : 160 + ed.getLang('plomino_accordion.delta_height', 0),
						inline : 1
					}, {
						plugin_url : url // Plugin absolute URL
					});
				}
			});

			// Register example button
			ed.addButton('plominoaccordion', {
				title : 'Plomino accordion section',
				cmd : 'mcePlominoAccordion',
				image : url + '/img/add_accordion.png'
			});

			// Add a node change handler, selects the button in the UI when an accordion is selected
			ed.onNodeChange.add(function(ed, cm, n) {
				cm.setActive('plominoaccordion', tinymce.DOM.getParent(n, "div.plomino-accordion-content") != null);
			});
		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plomino Accordion Plugin',
				author : 'Romaric BREIL',
				authorurl : 'http://tinymce.moxiecode.com',
				//infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/example',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('plomino_accordion', tinymce.plugins.PlominoAccordion);
})();
