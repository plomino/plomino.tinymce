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
        
        fieldtype = self.request.get("fieldtype", 'TEXT')
        fieldmode = self.request.get("fieldmode", 'EDITABLE')
        fieldformula = self.request.get("fieldformula", '')
        
        # self.context is the current field
        self.context.setFieldType(fieldtype)
        self.context.setFieldMode(fieldmode)
        self.context.setFormula(fieldformula)
        self.context.aq_inner.at_post_edit_script()
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_ok.htm?type=field&value=" + self.context.id)
