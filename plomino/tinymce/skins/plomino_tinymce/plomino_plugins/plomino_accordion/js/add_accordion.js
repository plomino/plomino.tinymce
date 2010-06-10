// Insert the header and wrap the selected content into the right tag
function insert_accordion() {
	var ed = tinyMCEPopup.editor;
	tinyMCEPopup.restoreSelection();
	var title = document.getElementById("title").value;
	var zone = '<h3 class="plomino-accordion-header">' + title + '</h3>'
				+ '<div class="plomino-accordion-content">' + ed.selection.getContent() + '</div>';
	ed.execCommand('mceInsertContent', false, zone, {skip_undo : 1});
	tinyMCEPopup.close();
}
