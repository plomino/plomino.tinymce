Introduction
============

Plomino TinyMCE Intrgration is a plugin for Plomino which allows to manage
easily Plomino objects (fields, actions and hidewhen) from TinyMCE interface.

Credits
========
Companies
---------
|makinacom|_

  * `Planet Makina Corpus <http://www.makina-corpus.org>`_
  * `Contact us <mailto:python@makina-corpus.org>`_

.. |makinacom| image:: http://depot.makina-corpus.org/public/logo.gif
.. _makinacom:  http://www.makina-corpus.com

Authors
------------

- Romaric Breil <romaric.breil@supinfo.com>
- Makina Corpus <python@makina-corpus.com>

Contributors
-----------------

- Mathieu Pasquet <kiorky@cryptelium.net>

Plomino Fields, Actions, Sub-forms and Hide-when Management
===========================================================

When a field is selected in the editor, a button in the interface of TinyMCE
allows to change some properties of this field.
By highlighting some text and clicking the same button, a field can be created
and its properties set (its name will be the selected text).

An action can also be created and modified using a similar mean.

You can only add an existing form in the editor (create a form before including
it).

A hide-when zone can be created directly from the editor. Select a part of the
form, click on the button, create the hide-when or select an existing one, and
apply. The selected zone will be surrounded with the correct start:hidewhen
and end:hidewhen tags.

Accordions Management
=====================

JQuery UI integration allows to include accordions in Plomino forms. An
accordion contains parts of a web page that can be collapsed or expanded when the
user clicks on the title of this zone.

This plugin allows to add up to four recursive ranges of accordions in a form,
and to remove an accordion section. To add a range, simply highlight a part of
the form, then click on the button "Plomino Accordion", enter the section
title, and apply.

To remove a part, place the cursor in a section (a red frame), without
selecting text, and click on the same button.
