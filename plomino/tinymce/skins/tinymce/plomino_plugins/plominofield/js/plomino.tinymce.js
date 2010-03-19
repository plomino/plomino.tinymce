// Functions called by the popup
var PlominoDialog = {	
	// Called when the "submit" button is clicked
	submit : function(type, value) {
		var ed = tinyMCEPopup.editor;
		
		if (type == 'action')
			var plominoClass = 'plominoActionClass';
		else if (type == 'field')
			var plominoClass = 'plominoFieldClass';
		else
			return;
		
		// String to add in the editor
		var span = '<span class="' + plominoClass + '">' + value + '</span>';
		
		// Insert or replace the selection
		tinyMCEPopup.restoreSelection();
		ed.execCommand('mceInsertContent', false, span, {skip_undo : 1});
	}
}
