enyoUtilityBelt
===============

Version 1.01

This is the ultimate utility tools used for enyo app development. Most of it to ease the development when deploying into PhoneGap and will exclude phonegap codes when it's deployed on pure web app.

[NEW] I've ADDED Sample folder on how to use all the libraries,CSSKit and components. Best possible combination is to
copy the util folder into lib then target it inside package.js $lib/util 

Utility Files
=============
- Base64.js
- Grappler.js 
- Validator.js
- PhoneGapSuit.js (this work in progress)
- CSSKit base.css (various fixes in IOS/Android e.g. overlay, hardware acceleration)

Common Classes
==============
Divided into control and component. Control is basically interactable UI element of enyo. You can include them using kind:"InsertControlNameHere" when you are doing your pages. Components is more like classes. Situated in com folder inside lib. 

Common - Control
================
- CartPrice.js - a simple control stylable in any form. Auto format currency once a value is set on it.
- ItemImageView.js - just setSize and setSrc to it, the spinner will appear when image is not loaded.

Common - Component
==================
- Global.js (A global appwise singleton, capable of storage localstorage in any form include object and also push pop memory item - usually used for history recalling values like navigation etc)


Sublime Text 2's Snippet
========================
- A standard bunch of sublime text 2 snippets
- Contains tab trigger snippets such as 

1. enyo.component (tab)
2. enyo.kind (tab)
3. enyo.control (tab)
4. enyo.scroller (tab) 
5. enyo.list (tab)
6. enyo.error(tab), errorHandler for Validator.js
7. enyo.slist(tab), creates a list without kind
8. enyo.layoutkind(tab), creates a layoutkind used in defining style for kind
9. enyo.static(tab), creates an empty sample static component


The MIT License Copyright (c) 2013 Ming Yuen Tutorial Tech Blog : http://www.isgoodstuff.com

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

