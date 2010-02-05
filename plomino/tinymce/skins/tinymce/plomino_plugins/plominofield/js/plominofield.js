var PlominoFieldDialog = {		
	init : function() {
    	var ed = tinyMCEPopup.editor;
    	
    	// Sélectionne le noeud parent de la sélection
		var selection = ed.selection.getNode();
		
		// Si le noeud est un <span class="plominoFieldClass"/>, sélectionner tout le contenu
		if (selection.getAttribute('class') == 'plominoFieldClass')
		{
			ed.selection.select(selection);
			fieldId = selection.firstChild.nodeValue;
		}
		// Sinon conserver la sélection
		else
			fieldId = ed.selection.getContent();
		
		// Remplit le champ du formulaire
		document.getElementById('plominoField').value = fieldId;
	},
		
	submit : function() {
		var ed = tinyMCEPopup.editor;
		var fieldIdInSpan = '<span class="plominoFieldClass">' + document.getElementById('plominoField').value + '</span>';
		
		tinyMCEPopup.restoreSelection();
		
		ed.execCommand('mceInsertContent', false, fieldIdInSpan, {skip_undo : 1});
		
		tinyMCEPopup.close();
		return;
	}
}

tinyMCEPopup.onInit.add(PlominoFieldDialog.init, PlominoFieldDialog);
