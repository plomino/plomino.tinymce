from Products.CMFPlomino.config import FIELD_TYPES#, FIELD_MODES
from Products.CMFPlomino.PlominoAction import ACTION_TYPES, ACTION_DISPLAY

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
            self.context.invokeFactory('PlominoField', Title=fieldid, id=fieldid, FieldType=fieldtype, FieldMode=fieldmode)
            field = self.context.aq_parent.aq_parent.getFormField(fieldid)
            field.setFormula(fieldformula)
            field.at_post_create_script()
            #field.setTitle(fieldid)
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plominofield/plominofield_submit.htm")

    def getActionTypes(self):
        """Return a list of possible types for an action.
        """
        return ACTION_TYPES
        
    def getActionDisplay(self):
        """Return a list of possible displays for an action.
        """
        return ACTION_DISPLAY

    def getActionProperties(self):
        """Return properties of an action, or , if no action is given, properties filled with None
        """
        action = getattr(self.context, self.request.get("actionid", None), None)
        if action:
            return {'actionType': action.getActionType(),
                    'actionDisplay': action.getActionDisplay(),
                    'content': action.getContent(),
                    'hideWhen': action.getHidewhen(),
                    'inActionBar': action.getInActionBar()
                    }
        else:
             return {'actionType': 'OPENFORM',
                     'actionDisplay': 'LINK',
                     'content': '',
                     'hideWhen': '',
                     'inActionBar': False
                     }
     
    def addAction(self):
        """ Add an action to the form. 
        """
        actionid = self.request.get("actionid", None)
        actionType = self.request.get("actiontype", 'OPENFORM')
        actionDisplay = self.request.get("actiondisplay", 'LINK')
        content = self.request.get("actioncontent", '')
        hideWhen = self.request.get("actionhidewhen", '')
        inActionBar = self.request.get("actioninactionbar", None) == 'on'
        
        # self.context is the current form
        if actionid and actionid not in (action.id for action in self.context.getActions(None, False)):
            self.context.invokeFactory('PlominoAction', Title=actionid, id=actionid, ActionType=actionType, ActionDisplay=actionDisplay, Content=content, Hidewhen=hideWhen, InActionBar=inActionBar)
            #action = getattr(self.context.aq_parent.aq_parent, actionid)
            #field.setTitle(fieldid)
        
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plominofield/plominofield_submit.htm")

    