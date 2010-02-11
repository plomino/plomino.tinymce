// Functions called by the popup
var PlominoFieldDialog = {	
	// Called when the popup is displayed 
	/*init : function() {
    	var ed = tinyMCEPopup.editor;
    	
    	// Select the parent node of the selection
		var selection = ed.selection.getNode();
		
		// If the node is a <span class="plominoFieldClass"/>, select all its content
		if (selection.getAttribute('class') == 'plominoFieldClass')
		{
			ed.selection.select(selection);
			var fieldId = selection.firstChild.nodeValue;
		}
		// Else, keep the selection 
		else
			var fieldId = ed.selection.getContent();
		
		// Fill the field in the form 
		document.getElementById('plominoFieldId_text').value = fieldId;
		
		var plominoFieldId_select = document.getElementById('plominoFieldId_select');
		
		for (var i = 0; i < plominoFieldId_select.length; i++) {
			if (plominoFieldId_select.options[i].value == fieldId)
				plominoFieldId_select.selectedIndex = i; 
		}
	},*/
	
	// Called when the "submit" button is clicked
	submit : function() {
		var ed = tinyMCEPopup.editor;
		
		// String to add in the editor
		var fieldIdInSpan = '<span class="plominoFieldClass">' + document.getElementById('plominoFieldId').value + '</span>';
		
		// Insert or replace the selection
		tinyMCEPopup.restoreSelection();
		ed.execCommand('mceInsertContent', false, fieldIdInSpan, {skip_undo : 1});

		//tinyMCEPopup.close();
		return;
	}
}

// The function "init" must be called when the popup is displayed
//tinyMCEPopup.onInit.add(PlominoFieldDialog.init, PlominoFieldDialog);
