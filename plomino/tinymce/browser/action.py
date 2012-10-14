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
        
        title = self.request.get("actiontitle", self.context.id)
        actionType = self.request.get("actiontype", 'OPENFORM')
        actionDisplay = self.request.get("actiondisplay", 'LINK')
        content = self.request.get("actioncontent", '')
        hideWhen = self.request.get("actionhidewhen", '')
        inActionBar = self.request.get("actioninactionbar", None) == 'on'
        
        # self.context is the current field
        self.context.setTitle(title)
        self.context.setActionType(actionType)
        self.context.setActionDisplay(actionDisplay)
        self.context.setContent(content)
        self.context.setHidewhen(hideWhen)
        self.context.setInActionBar(inActionBar)
        
        self.context.aq_inner.at_post_edit_script()
    
        self.request.RESPONSE.redirect(self.context.absolute_url() + "/../@@tinymceplominoform/valid_page?type=action&value=" + self.context.id)
        