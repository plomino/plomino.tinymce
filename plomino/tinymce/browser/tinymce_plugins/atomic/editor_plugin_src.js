/**
 *
 * @author Sander Kruger
 * @copyright Copyright � 2009, Sander Kruger, All rights reserved.
 */

(function() {
	var Event = tinymce.dom.Event;
	var direction = 0;	// Track cursor direction for skipping
	var hasClicked = false;	// Track mouseclicks for selecting
	var atStart = null;	// Cache if the cursor is at the start or at the end of
	var atEnd = null;	// an atom.

	tinymce.create('tinymce.plugins.AtomicPlugin', {
		init : function(ed, url) {
			var t = this, atomicClass;

			t.editor = ed;
			atomicClass = ed.getParam("atomic_atomic_class", "mceAtomic");

			ed.onNodeChange.addToTop(function(ed, cm, n) {
				var sc, ec, wasEnd=false;

				// Check if the start or end of the selection is in an atom
				sc = ed.dom.getParent(ed.selection.getStart(), function(n) {
					return ed.dom.hasClass(n, "plominoFieldClass") || ed.dom.hasClass(n, "plominoActionClass") || ed.dom.hasClass(n, "plominoSubformClass") || ed.dom.hasClass(n, "plominoHidewhenClass");
				});

				ec = ed.dom.getParent(ed.selection.getEnd(), function(n) {
					return ed.dom.hasClass(n, "plominoFieldClass") || ed.dom.hasClass(n, "plominoActionClass") || ed.dom.hasClass(n, "plominoSubformClass") || ed.dom.hasClass(n, "plominoHidewhenClass");
				});
				if (atEnd)
				{
					wasEnd = true;
				}
				atStart = null;
				atEnd = null;
				// Check situation to move the cursor or selection.
				if (sc || ec)
				{
					var s = ed.selection.getSel();
					var r = ed.selection.getRng();
					var select = s.type?(s.type!="None"):(s.anchorNode != s.focusNode || s.anchorOffset != s.focusOffset);
					var move = false;
					if (!select)
					{
						// The user has not selected anything but is moving the
						// cursor or clicked on an atom.
						if (direction == -1)
						{
							if (r.setStart)
							{
								var lc = t._leftNeighbour( ed, sc );
								if (lc)
								{
									// Make sure that when skipping to the left,
									// the next input doesn't go into the atom.
									var offset = lc.nodeType==3?lc.length:1;
									r.setStart( lc, offset );
									r.setEnd( lc, offset );
								}
								else
								{
									r.setStart( sc, 0 );
									r.setEnd( sc, 0 );
								}
								atStart = sc;
								move = true;
							}
							else
							{
								// ie (check if the caret is not just after the
								// atom)
								var r2 = ed.getBody().createTextRange();
								r2.moveToElementText( ec );
								r2.collapse(false);
								if (!r2.isEqual( r ))
								{
									r.moveToElementText( sc );
									r.collapse();
									atStart = sc;
									move = true;
								}
								else
								{
									var tempEl = ed.dom.create("span", null, "&shy;");
									ec.insertAdjacentElement("afterEnd", tempEl);

									r.moveToElementText(tempEl);
									r.collapse(false);
									ed.selection.setRng(r);

									ed.dom.remove(tempEl);
									atEnd = ec;
								}
							}
						}
						else if (direction == 1)
						{
							if (r.setStartAfter)
							{
								r.setStartAfter( ec );
								r.setEndAfter( ec );
								move = true;
							}
							else
							{
								if (wasEnd)
								{
									r.move( 'character' );
									ed.selection.setRng(r);
									ec = null;
								}
								else
								{
									var tempEl = ed.dom.create("span", null, "&shy;");
									ec.insertAdjacentElement("afterEnd", tempEl);

									r.moveToElementText(tempEl);
									r.collapse(false);
									ed.selection.setRng(r);

									ed.dom.remove(tempEl);
								}
							}
							atEnd = ec;
						}
						else if (hasClicked)
						{
							if (r.setStart)
							{
								r.setStart( sc, 0 );
								r.setEnd( ec, ec.childNodes.length );
							}
							else
							{
								// ie
								r.moveToElementText( sc );
							}
							move = true;
						}
						else if (wasEnd && !r.setStart)
						{
							// ie
							var tempEl = ed.dom.create("span", null, "&shy;");
							ec.insertAdjacentElement("afterEnd", tempEl);

							r.moveToElementText(tempEl);
							r.collapse(false);
							ed.selection.setRng(r);

							ed.dom.remove(tempEl);
							atEnd = ec;
						}
					}
					else
					{
						// Reverse selections have the anchor at the end and the
						// focus at the start. This happens when selecting
						// backwards. Make sure the extended selection keeps the
						// same direction.
						// *** Issue: ie doesn't support backward selections
						// programmatically (or at least I have not found how to
						// do this).
						var reverse = false;
						if (s.anchorNode && s.anchorNode == r.endContainer && s.anchorOffset == r.endOffset)
						{
							reverse = true;
						}
						var moveStart = false;
						var moveEnd = false;
						var rsc, rec;
						if (sc)
						{
							if (s.anchorNode)
							{
								if (sc != r.startContainer || (r.startOffset != 0 && r.startOffset != sc.childNodes.length))
								{
									// The start pos is not where it should be.
									moveStart = true;
								}
							}
							else
							{
								// ie
								rsc = ed.getBody().createTextRange();
								rsc.moveToElementText( sc );
								moveStart = (r.compareEndPoints( "StartToStart", rsc ) != 0);
							}
						}
						if (ec)
						{
							if (s.anchorNode)
							{
								if (ec != r.endContainer || (r.endOffset != 0 && r.endOffset != ec.childNodes.length))
								{
									// The end pos is not where it should be
									moveEnd = true;
								}
							}
							else
							{
								// ie
								rec = ed.getBody().createTextRange();
								rec.moveToElementText( ec );
								moveEnd = (r.compareEndPoints( "EndToEnd", rec ) != 0);
							}
						}
						if (reverse)
						{
							// Start with the end. Since 'selection direction detection'
							// doesn't work on IE, don't bother with the IE code here.
							if (moveEnd)
							{
								// If both start and end move and they move leftwards, set start first and then extend instead of starting with setend
								if (direction == -1)
								{
									r.setEnd( ec, 0 );
								}
								else
								{
									r.setEnd( ec, ec.childNodes.length );
								}
								move = true;
							}
							if (moveStart)
							{
								// Use the extend method to advance the focus
								// position of the selection.
								if (direction == 1)
								{
									s.extend( sc, sc.childNodes.length );
									move = false;
								}
								else
								{
									s.extend( sc, 0 );
									move = false;
								}
							}
						}
						else
						{
							if (moveStart)
							{
								if (direction == 1)
								{
									if (r.setStart)
									{
										r.setStart( sc, sc.childNodes.length );
									}
									else
									{
										// ie
										r.setEndPoint( "StartToEnd", rsc );
									}
								}
								else
								{
									if (r.setStart)
									{
										r.setStart( sc, 0 );
									}
									else
									{
										// ie
										r.setEndPoint( "StartToStart", rsc );
									}
								}
								move = true;
							}
							if (moveEnd)
							{
								if (direction == -1)
								{
									if (r.setEnd)
									{
										s.extend( ec, 0 );
									}
									else
									{
										// ie
										r.setEndPoint( "EndToStart", rec );
										move = true;
									}
								}
								else
								{
									if (r.setEnd)
									{
										s.extend( ec, ec.childNodes.length );
									}
									else
									{
										// ie
										r.setEndPoint( "EndToEnd", rec );
										move = true;
									}
								}
//								move = false;
							}
						}
					}
					if (move)
					{
						// Make sure other modules can react to this event.
						ed.selection.setRng( r );
					}
				}
			});

			ed.onKeyDown.addToTop( function(ed, e) {
				var k = e.keyCode, atomicClass;
				atomicClass = ed.getParam("atomic_atomic_class", "mceAtomic");
				hasClicked = false;
				direction = 0;
				if (k == 37 || k == 38)
				{
					direction = -1;
				}
				else if (k == 39 || k == 40)
				{
					direction = 1;
				}
				else if (k == 8)
				{
					// Check if an atom is being 'backspace'd
					if (!atEnd)
					{
						var s = ed.selection.getSel();
						var select = s.type?(s.type!="None"):(s.anchorNode != s.focusNode || s.anchorOffset != s.focusOffset);
						if (!select)
						{
							var ep = s.focusNode?((s.focusNode.nodeType == 3 && s.focusOffset != 0)?null:s.focusNode):ed.selection.getStart();
							if (ed.dom.hasClass(ep, atomicClass))
							{
								atEnd = ep;
							}
							else if (ep)
							{
								var rc;
								if (!s.focusNode)
								{
									// ie
									// focusOffset is not given. So, we need to find
									// it by walking through the children and comparing
									// end points.
									var r = ed.selection.getRng();
									var r2 = ed.getBody().createTextRange();
									r2.moveToElementText( ep );
									if (r2.compareEndPoints( "StartToStart", r ) == 0)
									{
										// The caret is at the start of this element.
										// Find the left neighbouring element
										rc = t._leftNeighbour( ed, ep );
									}
									else
									{
										// The focus is not at the start of the parent.
										// Find the child left of the caret.
										rc = ep.firstChild;
										while (rc)
										{
											// We are not interested in text nodes
											// because they cannot be atoms (all by
											// themselves)
											if (rc.nodeType == 1)
											{
												r2.moveToElementText( rc );
												if (r.compareEndPoints( "EndToEnd", r2 ) == 0)
												{
													break;
												}
											}
											rc = rc.nextSibling;
										}
									}
								}
								else
								{
									if (ep.nodeType == 1 && s.focusOffset != 0)
									{
										// ep encloses the current caret position.
										// select the child to the left of the caret.
										rc = ep.childNodes[s.focusOffset-1];
									}
									else
									{
										// The caret is on the left-most end of ep.
										// Find it's left neighbour.
										rc = t._leftNeighbour( ed, ep );
									}
								}
								if (rc)
								{
									// Now see if this element has a right-most
									// descendent that is an atom
									while (rc && !ed.dom.hasClass(rc, atomicClass))
									{
										rc = rc.lastChild;
									}
									if (rc)
									{
										atEnd = rc;
									}
								}
							}
						}
					}
					if (atEnd)
					{
						ed.dom.remove( atEnd );
						atEnd = null;
						return Event.cancel(e);
					}
				}
				else if (k == 46)
				{
					// Check if an atom is being 'delete'd
					if (!atStart)
					{
						var s = ed.selection.getSel();
						var select = s.type?(s.type!="None"):(s.anchorNode != s.focusNode || s.anchorOffset != s.focusOffset);
						if (!select)
						{
							var ep = s.focusNode?((s.focusNode.nodeType == 3 && s.focusOffset != s.focusNode.length)?null:s.focusNode):ed.selection.getEnd();
							if (ed.dom.hasClass(ep, atomicClass))
							{
								atStart = ep;
							}
							else if (ep)
							{
								var lc;
								if (!s.focusNode)
								{
									// ie
									// focusOffset is not given. So, we need to find
									// it by walking through the children and comparing
									// end points.
									var r = ed.selection.getRng();
									var r2 = ed.getBody().createTextRange();
									r2.moveToElementText( ep );
									if (r2.compareEndPoints( "EndToEnd", r ) == 0)
									{
										// The caret is at the start of this element.
										// Find the right neighbouring element
										lc = t._rightNeighbour( ed, ep );
									}
									else
									{
										// The focus is not at the end of the parent.
										// Find the child right of the caret.
										lc = ep.firstChild;
										while (lc)
										{
											// We are not interested in text nodes
											// because they cannot be atoms (all by
											// themselves)
											if (lc.nodeType == 1)
											{
												r2.moveToElementText( lc );
												if (r.compareEndPoints( "StartToStart", r2 ) == 0)
												{
													break;
												}
											}
											lc = lc.nextSibling;
										}
									}
								}
								else
								{
									if (ep.nodeType == 1 && s.focusOffset != ep.childNodes.length)
									{
										// ep encloses the current caret position.
										// select the child to the right of the caret.
										lc = ep.childNodes[s.focusOffset];
									}
									else
									{
										// The caret is on the right-most end of ep.
										// Find it's right neighbour.
										lc = t._rightNeighbour( ed, ep );
									}
								}
								if (lc)
								{
									// Now see if this element has a left-most
									// descendent that is an atom
									while (lc && !ed.dom.hasClass(lc, atomicClass))
									{
										lc = lc.firstChild;
									}
									if (lc)
									{
										atStart = lc;
									}
								}
							}
						}
					}
					if (atStart)
					{
						ed.dom.remove( atStart );
						atStart = null;
						return Event.cancel(e);
					}
				}
			});

			ed.onMouseDown.addToTop(t._onClick);
			ed.onMouseUp.addToTop(t._onClick);
		},

		getInfo : function() {
			return {
				longname : 'Atomic elements',
				author : 'Sander Kruger',
				authorurl : 'http://www.3gsp.eu',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/atomic',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		},

		_onClick : function(ed, e) {
			direction = 0;
			hasClicked = true;
			atStart = null;
			atEnd = null;
		},
		
		// Helper methods
		_leftNeighbour : function( ed, e ) {
			var l = ed.dom.getParent(e, function(n) {
				return e.previousSibling != null;
			});
			if (l)
			{
				return l.previousSibling;
			}
			return null;
		},

		_rightNeighbour : function( ed, e ) {
			var r = ed.dom.getParent(e, function(n) {
				return e.nextSibling != null;
			});
			if (r)
			{
				return r.nextSibling;
			}
			return null;
		}
	});

	// Register plugin
	tinymce.PluginManager.add('atomic', tinymce.plugins.AtomicPlugin);
})();