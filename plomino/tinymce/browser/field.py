class PlominoField(object):
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

    def setFieldProperties(self):
        """Set field properties to their new values. 
        """
        fieldid = self.request.get("fieldid", None)
        fieldtype = self.request.get("fieldtype", None)
        fieldmode = self.request.get("fieldmode", None)
        fieldformula = self.request.get("fieldformula", None)
        
        # self.context is the current field
        if fieldid and fieldid == self.context.id:
            if fieldtype:
                self.context.setFieldType(fieldtype)
            if fieldmode:
                self.context.setFieldMode(fieldmode)
            if fieldformula:
                self.context.setFormula(fieldformula)
            self.context.aq_parent.aq_parent.at_post_edit_script()
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plominofield/plominofield_submit.htm")
