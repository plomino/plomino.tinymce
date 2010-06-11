// Insert the header and wrap the selected content into the right tag
function insert_accordion() {
	var ed = tinyMCEPopup.editor;
	tinyMCEPopup.restoreSelection();
	var selection = ed.selection.getContent();

	var node = ed.selection.getNode();
	
	var nbAncestors = 3 + tinymce.DOM.getParents(node, "div.plomino-accordion-content").length;
	
	if (nbAncestors <= 6)
	{
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
