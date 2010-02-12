from Products.CMFPlomino.config import FIELD_TYPES


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
    
    def setFieldProperties(self):
        """Set field properties to their new values. 
        """
        fieldid = self.request.get("fieldid", None)
        fieldtype = self.request.get("fieldtype", None)
        #fieldtitle = self.request.get("fieldtitle", None)
        
        # self.context is the current field
        if fieldid and fieldid == self.context.id:
            if fieldtype:
                self.context.FieldType = fieldtype
            #if fieldtitle:
            #    self.context.title = fieldtitle
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plominofield/plominofield_submit.htm")
