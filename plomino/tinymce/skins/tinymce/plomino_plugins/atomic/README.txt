The plugin Atomic was modified to be compatible with Plomino and TinyMCE
integration in Plone.

It doesn't exists any manner to pass an argument to this plugin without
modification in Products.TinyMCE. The patch consist in a replacement of
"mceAtomic" class by "plominoFieldClass" for the default option.

When there will exist a mean to pass parameters to TinyMCE plugins, the
modification will be cancelled.
