class PlominoCache(object):
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

    def setCacheProperties(self):
        """Set PlominoCache properties to their new values. 
        """
        cacheformula = self.request.get("cacheformula", '')
        
        # self.context is the current hide-when
        self.context.setFormula(cacheformula)
        self.context.aq_inner.at_post_edit_script()
        
        self.request.RESPONSE.redirect(self.context.absolute_url() + "/../@@tinymceplominoform/valid_page?type=cache&value=" + self.context.id)
