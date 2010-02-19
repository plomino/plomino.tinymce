from Products.CMFPlomino.config import FIELD_TYPES#, FIELD_MODES


class PlominoForm(object):
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
        
    def addField(self):
        """ Add a field to the form. 
        """
        fieldid = self.request.get("fieldid", None)
        fieldtype = self.request.get("fieldtype", "TEXT")
        fieldmode = self.request.get("fieldmode", "EDITABLE")
        fieldformula = self.request.get("fieldformula", "")
        
        # self.context is the current form
        if fieldid and fieldid not in (field.id for field in self.context.getFields()):
            self.context.invokeFactory('PlominoField', id=fieldid, Title=fieldid, FieldType=fieldtype, FieldMode=fieldmode)
            field = self.context.aq_parent.aq_parent.getFormField(fieldid)
            field.setFormula(fieldformula)
            field.at_post_create_script()
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plominofield/plominofield_submit.htm")
