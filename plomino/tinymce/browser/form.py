from Products.CMFPlomino.config import FIELD_TYPES, FIELD_MODES
from Products.CMFPlomino.PlominoAction import ACTION_TYPES, ACTION_DISPLAY
from Products.CMFPlomino.PlominoAction import PlominoAction
from Products.CMFPlomino.PlominoField import PlominoField
from Products.CMFPlomino.PlominoHidewhen import PlominoHidewhen

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
        return FIELD_MODES

    def getField(self):
        """Return a field from the request, or the first field if empty, or None if the specified field doesn't exist. 
        """
        fieldid = self.request.get("fieldid", None)
        if fieldid:
            field = getattr(self.context, fieldid, None)
            if isinstance(field, PlominoField):
                return field
            else:
                return None
        
        fieldsList = self.context.getFields()
        if len(fieldsList) > 0:
            return fieldsList[0]
        else:
            return None

    def getFieldProperties(self):
        """Return properties of an action, or , if no action is given, properties filled with default values.
        """
        field = self.getField()
        if field:
            return {'fieldType': field.getFieldType(),
                    'fieldMode': field.getFieldMode(),
                    'formula': field.getFormula()
                    }
        else:
             return {'fieldType': 'TEXT',
                    'fieldMode': 'EDITABLE',
                    'formula': ''
                    }
        
    def addField(self):
        """Add a field to the form. 
        """
        fieldid = self.request.get("fieldid", None)
        fieldtype = self.request.get("fieldtype", "TEXT")
        fieldmode = self.request.get("fieldmode", "EDITABLE")
        fieldformula = self.request.get("fieldformula", "")
        
        # self.context is the current form
        if fieldid:
            if not hasattr(self.context, fieldid):
                self.context.invokeFactory('PlominoField', Title=fieldid, id=fieldid, FieldType=fieldtype, FieldMode=fieldmode)
                field = self.context.aq_parent.aq_parent.getFormField(fieldid)
                field.setFormula(fieldformula)
                field.setTitle(fieldid)
                field.at_post_create_script()
                
                self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_ok.htm?type=field&value=" + fieldid + "&fieldurl=" + "/".join(field.getPhysicalPath()))
            
            else:
                self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_err.htm?error=object_exists")
            
        else:
            self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_err.htm?error=no_field")
            

    def getActionTypes(self):
        """Return a list of possible types for an action.
        """
        return ACTION_TYPES
        
    def getActionDisplay(self):
        """Return a list of possible displays for an action.
        """
        return ACTION_DISPLAY

    def getAction(self):
        """Return an action from the request, or the first action if empty, or None if the specified action doesn't exist. 
        """
        actionid = self.request.get("actionid", None)
        if actionid:
            action = getattr(self.context, actionid, None)
            if isinstance(action, PlominoAction):
                return action
            else:
                return None
        
        actionsList = self.context.getActions(None, False)
        if len(actionsList) > 0:
            return actionsList[0]
        else:
            return None

    def getActionProperties(self):
        """Return properties of an action, or , if no action is given, properties filled with default values.
        """
        action = self.getAction()
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
        if actionid:
            if not hasattr(self.context, actionid):
                self.context.invokeFactory('PlominoAction', Title=actionid, id=actionid, ActionType=actionType, ActionDisplay=actionDisplay, Content=content, Hidewhen=hideWhen, InActionBar=inActionBar)
                action = getattr(self.context.aq_parent.aq_parent, actionid)
                action.setTitle(actionid)
                #action = getattr(self.context.aq_parent.aq_parent, actionid)
                #action.at_post_edit_script()
        
                self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_ok.htm?type=action&value=" + actionid)
            
            else:
                self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_err.htm?error=object_exists")
            
        else:
            self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_err.htm?error=no_action")
        
    def getSubForms(self):
        """Returns a list of forms from the parent database, without the current form
        """
        form = self.context.aq_parent.aq_parent
        subforms = form.getParentDatabase().getForms()
        subforms.remove(form)
        return subforms
    
    def getHidewhen(self):
        """Returns a hide-when formula from the request, or the first hide-when formula if empty, or None if the specified hide-when doesn't exist. 
        """
        hidewhenid = self.request.get("hidewhenid", None)
        
        if self.request.get("create", False):
            return None
        
        if hidewhenid:
            hidewhen = getattr(self.context, hidewhenid, None)
            if isinstance(hidewhen, PlominoHidewhen):
                return hidewhen
            else:
                return None
        
        hidewhenList = self.context.getHidewhenFormulas()
        if len(hidewhenList) > 0:
            return hidewhenList[0]
        else:
            return None

    def getHidewhenFormula(self):
        """Returns properties of a hide-when formula, or, if no hide-when formula is given, properties filled with default values.
        """
        hidewhen = self.getHidewhen()
        if hidewhen:
            return hidewhen.getFormula()
        else:
             return ''
         
    def addHidewhen(self):
        """ Add a hide-when to the form. 
        """
        hidewhenid = self.request.get("hidewhenid", None)
        hidewhenformula = self.request.get("hidewhenformula", '')
        
        # self.context is the current form
        if hidewhenid:
            if not hasattr(self.context, hidewhenid):
                self.context.invokeFactory('PlominoHidewhen', Title=hidewhenid, id=hidewhenid, Formula=hidewhenformula)
                hidewhen = getattr(self.context.aq_parent.aq_parent, hidewhenid)
                hidewhen.setTitle(hidewhenid)
#                hidewhen.at_post_edit_script()

                self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_ok.htm?type=hidewhen&value=" + hidewhenid)
            
            else:
                self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_err.htm?error=object_exists")
            
        else:
            self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_err.htm?error=no_hidewhen")
        