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
        hidewhentype = self.request.get("hidewhentype", 'static')
        
        # self.context is the current hide-when
        self.context.setFormula(hidewhenformula)
        self.context.isDynamicHidewhen = hidewhentype == 'dynamic'
        self.context.aq_inner.at_post_edit_script()
        
        self.request.RESPONSE.redirect(self.context.absolute_url() + "/../@@tinymceplominoform/valid_page?type=hidewhen&value=" + self.context.id)
