from Products.CMFPlomino.config import FIELD_TYPES#, FIELD_MODES


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
     
    def getFieldTypes(self):
        """Return a list of possible types for a field.
        """
        return [(pair[0], pair[1][0]) for pair in FIELD_TYPES.items()]
    
    def getFieldModes(self):
        """Return a list of possible modes for a field.
        """
        # replace with "return FIELD_MODES" when available (see import)
        return [["EDITABLE", "Editable"], ["COMPUTED", "Computed"], ["CREATION", "Computed on creation"], ["DISPLAY", "Computed for display"]]
    
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
                self.context.FieldType = fieldtype
            if fieldmode:
                self.context.FieldMode = fieldmode
            if fieldformula:
                self.context.setFormula(fieldformula)
            #print self.context
            self.context.aq_parent.aq_parent.at_post_edit_script()
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plominofield/plominofield_submit.htm")
        #return "test"
