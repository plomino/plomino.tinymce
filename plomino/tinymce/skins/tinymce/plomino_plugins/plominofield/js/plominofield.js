// Functions called by the popup
var PlominoFieldDialog = {	
	// Called when the popup is displayed 
	init : function() {
    	var ed = tinyMCEPopup.editor;
    	
    	// Select the parent node of the selection
		var selection = ed.selection.getNode();
		
		// If the node is a <span class="plominoFieldClass"/>, select all its content
		if (selection.getAttribute('class') == 'plominoFieldClass')
		{
			ed.selection.select(selection);
			fieldId = selection.firstChild.nodeValue;
		}
		// Else, keep the selection 
		else
			fieldId = ed.selection.getContent();
		
		// Fill the field in the form 
		document.getElementById('plominoField').value = fieldId;
	},
	
	// Called when the "submit" button is clicked
	submit : function() {
		var ed = tinyMCEPopup.editor;
		
		// String to add in the editor
		var fieldIdInSpan = '<span class="plominoFieldClass">' + document.getElementById('plominoField').value + '</span>';
		
		// Insert or replace the selection
		tinyMCEPopup.restoreSelection();
		ed.execCommand('mceInsertContent', false, fieldIdInSpan, {skip_undo : 1});
		
		tinyMCEPopup.close();
		return;
	}
}

// The function "init" must be called when the popup is displayed
tinyMCEPopup.onInit.add(PlominoFieldDialog.init, PlominoFieldDialog);
