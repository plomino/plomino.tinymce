def postInstall(context):
    """Called as at the end of the setup process. """
    
    site = context.getSite()
    if hasattr(site, "portal_tinymce"):
        site.portal_tinymce.customplugins = '\n'.join((line for line in site.portal_tinymce.customplugins.splitlines() if line != "plominofield|/plomino_plugins/plominofield/editor_plugin.js"))
