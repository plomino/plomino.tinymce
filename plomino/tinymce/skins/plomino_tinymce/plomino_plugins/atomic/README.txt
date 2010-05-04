The plugin Atomic was modified to be compatible with Plomino TinyMCE
Integration plugin in Plone.

It is distributed by MoxieCode on SourceForge (http://sourceforge.net/tracker/
index.php?func=detail&aid=2519211&group_id=103281&atid=738747 and
http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/atomic).

It does not exist any mean to pass an argument to this plugin without
modification in Products.TinyMCE, or, more generally, to pass in argument more
than one class to the plugin. The patch modifies how Atomic detects if the
selection starts or end in an atomic class (addition on another condition in
the onNodeChange event manager).

If a mean appears to pass parameters to TinyMCE plugins and to pass more than
one class to Atomic, the modification will be cancelled.
