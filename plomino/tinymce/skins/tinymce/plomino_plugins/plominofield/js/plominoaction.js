// Functions called by the popup
var PlominoActionDialog = {	
	// Called when the "submit" button is clicked
	submit : function() {
		var ed = tinyMCEPopup.editor;
		
		// String to add in the editor
		var span = '<span class="plominoActionClass">' + document.getElementById('actionid').value + '</span>';
		
		// Insert or replace the selection
		tinyMCEPopup.restoreSelection();
		ed.execCommand('mceInsertContent', false, span, {skip_undo : 1});
	}
}
