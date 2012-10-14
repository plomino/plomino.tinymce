from zope import component, interface

from Products.Five import BrowserView
from Products.Five.browser.pagetemplatefile import ViewPageTemplateFile

class ILayer(interface.Interface):
    """Marker interface that defines a Zope 3 browser layer.
    """ 

class ITinyMCEPlominoFormView(interface.Interface):
    """Marker interface"""


class TinyMCEPlominoFormView(BrowserView):
    """
    """
    interface.implements(ITinyMCEPlominoFormView)
    
    action_template = ViewPageTemplateFile('action.pt')
    def action_form(self, **params):
        """."""
        params = {}
        return self.action_template(**params)
    
    cache_template = ViewPageTemplateFile('cache.pt')
    def cache_form(self, **params):
        """."""
        params = {}
        return self.cache_template(**params)
    
    field_template = ViewPageTemplateFile('field.pt')
    def field_form(self, **params):
        """."""
        params = {}
        return self.field_template(**params)
    
    hidewhen_template = ViewPageTemplateFile('hidewhen.pt')
    def hidewhen_form(self, **params):
        """."""
        params = {}
        return self.hidewhen_template(**params)
    
    subform_template = ViewPageTemplateFile('subform.pt')
    def subform_form(self, **params):
        """."""
        params = {}
        return self.subform_template(**params)
    
    error_template = ViewPageTemplateFile('error.pt')
    def error_page(self, **params):
        """."""
        params = {}
        return self.error_template(**params)
    
    valid_template = ViewPageTemplateFile('valid.pt')
    def valid_page(self, **params):
        """."""
        params = {}
        return self.valid_template(**params)