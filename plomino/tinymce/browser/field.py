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
        fieldtype = self.request.get("fieldtype", None)
        
        if (fieldtype):
            self.FieldType = fieldtype
            
        self.request.RESPONSE.redirect(self.portal_url + "/plomino_plugins/plominofield/plominofield_submit.htm")
        