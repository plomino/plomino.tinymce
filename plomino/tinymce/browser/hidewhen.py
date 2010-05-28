class PlominoHidewhen(object):
    """
    """
    
    def __init__(self, context, request):
        """Initialize adapter."""
        self.context = context
        self.request = request
        
    def __call__(self):
        """
        """
        return self

    def setHidewhenProperties(self):
        """Set hide-when properties to their new values. 
        """
        hidewhenformula = self.request.get("hidewhenformula", '')
        
        # self.context is the current hide-when
        self.context.setFormula(hidewhenformula)
        self.context.aq_inner.at_post_edit_script()
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_ok.htm?type=hidewhen&value=" + self.context.id)
