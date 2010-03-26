from Products.CMFPlomino.PlominoAction import ACTION_TYPES, ACTION_DISPLAY

class PlominoAction(object):
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
        
    def setActionProperties(self):
        """Set field properties to their new values. 
        """
        
        actionType = self.request.get("actiontype", 'OPENFORM')
        actionDisplay = self.request.get("actiondisplay", 'LINK')
        content = self.request.get("actioncontent", '')
        hideWhen = self.request.get("actionhidewhen", '')
        inActionBar = self.request.get("actioninactionbar", None) == 'on'
        
        # self.context is the current field
        self.context.setActionType(actionType)
        self.context.setActionDisplay(actionDisplay)
        self.context.setContent(content)
        self.context.setHidewhen(hideWhen)
        self.context.setInActionBar(inActionBar)
        
        self.context.aq_parent.aq_parent.at_post_edit_script()
    
        self.request.RESPONSE.redirect(self.context.portal_url() + "/plomino_plugins/plomino_tinymce/plomino.tinymce_submit_ok.htm?type=action&value=" + self.context.id)
