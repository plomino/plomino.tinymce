// Insert the header and wrap the selected content into the right tag
function insert_accordion() {
	var ed = tinyMCEPopup.editor;
	tinyMCEPopup.restoreSelection();
	var selection = ed.selection.getContent();

	// Count the number of recursive accordions (must be in 3..6)
	var nbAncestors = 3 + tinymce.DOM.getParents(ed.selection.getNode(), "div.plomino-accordion-content").length;
	if (nbAncestors <= 6)
	{
		// Insert the accordion
		var title = document.getElementById("title").value;
		var zone = '<h' + nbAncestors + ' class="plomino-accordion-header"><a href="#">' + title + '</a></h' + nbAncestors + '>'
					+ '<div class="plomino-accordion-content">' + selection + '</div>';
		ed.execCommand('mceInsertContent', false, zone, {skip_undo : 1});
	}
	else
	{
		alert("Too many recursive sections.");
	}
	
	tinyMCEPopup.close();
}
