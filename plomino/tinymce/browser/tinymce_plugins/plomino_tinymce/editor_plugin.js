(function() {
	// Load plugin specific language pack (add languages in the string to load it).
	// The test is required when a language is not provided, to fall back to English.
	if ("en,fr".indexOf(tinyMCE.settings.language) != -1)
		tinymce.PluginManager.requireLangPack('plomino_tinymce');

	tinymce.create('tinymce.plugins.PlominoPlugin', {
		/**
		 * Initializes the plugin, this will be executed after the plugin has been created.
		 * This call is done before the editor instance has finished it's initialization so use the onInit event
		 * of the editor instance to intercept that event.
		 *
		 * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
		 * @param {string} url Absolute URL to where the plugin is located.
		 */
		init : function(ed, url) {
			// Get the physical path of the current Zope object
			tinymce.util.XHR.send({
				url : './absolute_url_path',
				success : function(text) {
					zopePhysicalPath = text;
				}
			});

		
			var editFunction = this.editFormElement;
			
			// Register buttons
			ed.addButton('plominofield', {
				title : ed.getLang('plomino_tinymce.field', "Add/edit a Plomino Field"),
				onclick : function() { editFunction(ed, url, 'field'); },
				image : url + '/img/PlominoField.png'
			});
			ed.addButton('plominoaction', {
				title : ed.getLang('plomino_tinymce.action', "Add/edit a Plomino Action"),
				onclick : function() { editFunction(ed, url, 'action'); },
				image : url + '/img/PlominoAction.png'
			});
			ed.addButton('plominosubform', {
				title : ed.getLang('plomino_tinymce.subform', "Add a Plomino Sub-form"),
				onclick : function() { editFunction(ed, url, 'subform'); },
				image : url + '/img/PlominoForm.png'
			});
			ed.addButton('plominohidewhen', {
				title : ed.getLang('plomino_tinymce.hidewhen', "Add a Plomino Hiden-when zone"),
				onclick : function() { editFunction(ed, url, 'hidewhen'); },
				image : url + '/img/PlominoHideWhen.png'
			});
			ed.addButton('plominocache', {
				title : ed.getLang('plomino_tinymce.cache', "Add a Plomino cache fragment"),
				onclick : function() { editFunction(ed, url, 'cache'); },
				image : url + '/img/PlominoCache.png'
			});
			
			var isNotFormEditor = document.getElementById('FormLayout') == null;
			/*
			 * If the editor is not in the form edition page, disable buttons and avoid their reactivation.
			 * If the selected text is a plomino item, disable buttons for other classes.
			 */
			ed.onNodeChange.add(function(ed) {
				var curNode = ed.selection.getNode();
				var isField = ed.dom.hasClass(curNode, 'plominoFieldClass');
				var isAction = ed.dom.hasClass(curNode, 'plominoActionClass');
				var isSubform = ed.dom.hasClass(curNode, 'plominoSubformClass');
				var isHidewhen = ed.dom.hasClass(curNode, 'plominoHidewhenClass');
				var isCache = ed.dom.hasClass(curNode, 'plominoCacheClass');
				var isPlominoClass = isField || isAction || isSubform || isHidewhen || isCache;
				
				ed.controlManager.setDisabled('plominofield', isNotFormEditor || (isPlominoClass && !isField));
				ed.controlManager.setDisabled('plominoaction', isNotFormEditor || (isPlominoClass && !isAction));
				ed.controlManager.setDisabled('plominosubform', isNotFormEditor || (isPlominoClass && !isSubform));
				ed.controlManager.setDisabled('plominohidewhen', isNotFormEditor || (isPlominoClass && !isHidewhen));
				ed.controlManager.setDisabled('plominocache', isNotFormEditor || (isPlominoClass && !isCache));
			});
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
		 * Shows the field, action or subform editor
		 *
		 * @param {Object} ed Editor instance.
		 * @param {String} url Source url.
		 * @param {String} elementType Type of the element to edit (field or action).
		 */
		editFormElement : function(ed, url, elementType) {
			// If the form is being created, don't create the same command
			if (location.pathname.indexOf("portal_factory/PlominoForm") != -1)
			{
				alert(ed.getLang('plomino_tinymce.edition_forbidden', 'Please save the form before using this button.'));
				return;
			}
			
			if (elementType === "field") {
				var elementClass = 'plominoFieldClass';
				var elementEditionPage = '@@tinymceplominoform/field_form';
				var elementIdName = 'fieldid';
			}
			else if (elementType === "action") {
				var elementClass = 'plominoActionClass';
				var elementEditionPage = '@@tinymceplominoform/action_form';
				var elementIdName = 'actionid';
			}
			else if (elementType === "subform") {
				var elementClass = 'plominoSubformClass';
				var elementEditionPage = '@@tinymceplominoform/subform_form';
				var elementIdName = 'subformid';
			}
			else if (elementType === "hidewhen") {
				var elementClass = 'plominoHidewhenClass';
				var elementEditionPage = '@@tinymceplominoform/hidewhen_form';
				var elementIdName = 'hidewhenid';
			}
			else if (elementType === "cache") {
				var elementClass = 'plominoCacheClass';
				var elementEditionPage = '@@tinymceplominoform/cache_form';
				var elementIdName = 'cacheid';
			}
			else
				return;
			
			// Find the element id
			// Select the parent node of the selection
			var selection = ed.selection.getNode();
			// If the node is a <span class="plominoFieldClass"/>, select all its content
			if (tinymce.DOM.hasClass(selection, elementClass)) 
			{
				ed.selection.select(selection);
				var elementId = selection.firstChild.nodeValue;
				
				// hide-when and cache zones start with start:id and finish with end:id
				if (elementType === "hidewhen" || elementType === "cache")
				{
					var splittedId = elementId.split(':');
					if (splittedId.length > 1)
						elementId = splittedId[1];
				}
			}
			else if (elementType !== "hidewhen" && elementType !== "cache")
			{
				// If the selection contains a <span class="plominoFieldClass"/>, select all its content
				nodes = tinymce.DOM.select('span.' + elementClass, selection);
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
						var elementId = node.firstChild.nodeValue;
					}
					// Else, keep the selection
					else
						var elementId = ed.selection.getContent();
				}
				
				// Else, keep the selection 
				else
					var elementId = ed.selection.getContent();
			}
			else
			{
				var elementId = '';
			}
			
			ed.windowManager.open({
				// GET the parent pathname (part of the URL) and the field selected in the editor
				//file : url + elementEditionPage + '?parent=' + zopePhysicalPath + '&' + elementIdName + '=' + elementId,
			    file : zopePhysicalPath + '/' + elementEditionPage + '?' + elementIdName + '=' + elementId,
				width : 600 + parseInt(ed.getLang('plomino_tinymce.delta_width', 0)),
				height : 400 + parseInt(ed.getLang('plomino_tinymce.delta_height', 0)),
				inline : 1
			}, {
				plugin_url : url/*, // Plugin absolute URL
				some_custom_arg : 'custom arg' // Custom argument*/
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
				longname : 'Plomino Tinymce Integration Plugin',
				author : 'Romaric BREIL',
				authorurl : 'http://tinymce.moxiecode.com',
				//infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/example',
				version : "1.0"
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('plomino_tinymce', tinymce.plugins.PlominoPlugin);
})();
