function updateFieldSettingsLink(type) {
	link = document.getElementById('fieldSettingsLink');
	href = link.getAttribute('href');
	href = href.replace(/[a-z]+settings$/g, type.toLowerCase() + 'settings');
	link.setAttribute('href', href);
}
