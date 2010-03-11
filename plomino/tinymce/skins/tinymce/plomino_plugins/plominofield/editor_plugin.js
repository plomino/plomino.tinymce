(function() {
	// Load plugin specific language pack
	tinymce.PluginManager.requireLangPack('plominofield');

	tinymce.create('tinymce.plugins.PlominoFieldPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			// If the form is being created, don't create the same command
			if (location.pathname.indexOf("portal_factory/PlominoForm") != -1)
				ed.addCommand('mcePlominoField', function() {
					alert("Please save the form before using this button.");
				});
		
			// Register the command so that it can be invoked by using tinyMCE.activeEditor.execCommand('mceExample');
			else
				ed.addCommand('mcePlominoField', function() {
					
					// Find the field id
					// Select the parent node of the selection
					var selection = ed.selection.getNode();
					// If the node is a <span class="plominoFieldClass"/>, select all its content
					if (tinymce.DOM.hasClass(selection, 'plominoFieldClass'))
					{
						ed.selection.select(selection);
						var fieldId = selection.firstChild.nodeValue;
					}
					else
					{
						// If the selection contains a <span class="plominoFieldClass"/>, select all its content
						nodes = tinymce.DOM.select('span.plominoFieldClass', selection);
						if (nodes.length > 0)
						{
							// Search if a node in the found nodes belongs to the selection
							for (var i = 0; i < nodes.length; i++)
							{
								if (ed.selection.getContent().indexOf(tinymce.DOM.getOuterHTML(nodes[i])) != -1)
								{
									var node = nodes[i];
									break;
								}
							}
							
							// If a node is found, select it
							if (node)
							{
								ed.selection.select(node);
								var fieldId = node.firstChild.nodeValue;
							}
							// Else, keep the selection
							else
								var fieldId = ed.selection.getContent();
						}
						
						// Else, keep the selection 
						else
							var fieldId = ed.selection.getContent();
					}
					
					ed.windowManager.open({
						// GET the parent pathname (part of the URL) and the field selected in the editor
						file : url + '/plominofield.htm?parent=' + location.pathname + '&fieldid=' + fieldId,
						width : 600 + parseInt(ed.getLang('plominofield.delta_width', 0)),
						height : 400 + parseInt(ed.getLang('plominofield.delta_height', 0)),
						inline : 1
					}, {
						plugin_url : url/*, // Plugin absolute URL
						some_custom_arg : 'custom arg' // Custom argument*/
					});
				});

			// Register example button
			ed.addButton('plominofield', {
				title : 'Add/edit a Plomino Field',
				cmd : 'mcePlominoField',
				image : url + '/img/PlominoField.png'
			});

			// Add a node change handler, selects the button in the UI when a image is selected
//			ed.onNodeChange.add(function(ed, cm, n) {
//				cm.setActive('example', n.nodeName == 'IMG');
//			});
		},

		/**
		 * Creates control instances based in the incomming name. This method is normally not
		 * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
		 * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
		 * method can be used to create those.
		 *
		 * @param {String} n Name of the control to create.
		 * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
		 * @return {tinymce.ui.Control} New control instance or null if no control was created.
		 */
//		createControl : function(n, cm) {
//			return null;
//		},

		/**
		 * Returns information about the plugin as a name/value array.
		 * The current keys are longname, author, authorurl, infourl and version.
		 *
		 * @return {Object} Name/value array containing information about the plugin.
		 */
		getInfo : function() {
			return {
				longname : 'Plomino Field Edition Plugin',
				author : 'Romaric BREIL',
				authorurl : 'http://tinymce.moxiecode.com',
				//infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/example',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('plominofield', tinymce.plugins.PlominoFieldPlugin);
})();