// Functions called by the popup
var PlominoFieldDialog = {
	// Called when the "submit" button is clicked
	submit : function() {
		var ed = tinyMCEPopup.editor;
		
		// String to add in the editor
		var fieldIdInSpan = '<span class="plominoFieldClass">' + document.getElementById('plominoFieldId').value + '</span>';
		
		// Insert or replace the selection
		tinyMCEPopup.restoreSelection();
		ed.execCommand('mceInsertContent', false, fieldIdInSpan, {skip_undo : 1});
	}
}
