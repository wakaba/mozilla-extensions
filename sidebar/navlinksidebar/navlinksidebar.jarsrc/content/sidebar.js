function init() {
  const kObserverServiceIID  = "@mozilla.org/observer-service;1";
  var NavLoadObserver = {
    observe: function(aWindow) {
      if (document.getElementById('pageFixed').checked) returnv (true);
      var hLinks = aWindow.document.getElementsByTagName('link');
      var rURI;
      var linkTypes = ["sidebar navigator", "navigator", "contents", "toc", "index", "start", "top", "home"];
      // Actually we should also check "navigation sidebar"
      Links :
        for (var j = 0; j < linkTypes.length; j++) {
          for (var i = 0; i < hLinks.length; i++) {
            if (hLinks[i].rel.replace(/\s+/,' ').toLowerCase() == linkTypes[j]) {
              rURI = hLinks[i].href;
              break Links;
            }
          }
        }
      if (rURI && document.getElementById('navBrowser')) {
        var navBrowser = document.getElementById('navBrowser');
        if (navBrowser.contentWindow.location.href != rURI) {
          navBrowser.contentWindow.location.href = rURI;
          navBrowser.addEventListener("load", function(){
            var navDoc = navBrowser.contentWindow.document;
            var rLinks = navDoc.links;	// A and AREA
            if (!rLinks) rLinks = navDoc.getElementsByTagName('a');
            var dURI = navBrowser.contentWindow.location.href.replace(/\#.*$/,'')
                     + '#';
            for (var i = 0; i < rLinks.length; i++) { 
              if (!rLinks[i].target) {
                //if (rLinks[i].href.indexOf(dURI) != 0)
                  rLinks[i].target = '_content';
              }
            }
            var rForms = navDoc.getElementsByTagName('form');
            for (var j = 0; j < rForms.length; j++) { 
              if (!rForms[j].target) rForms[j].target = '_content';
            }
            /* TODO: Namespace should be used, but it does not work
                     when shown document is HTML, not XML. */
            navDoc.getElementsByTagName('html')[0].setAttribute('xMozSbNpUri',dURI);
            var l = navDoc.createElement('link');
            l.setAttribute('href',location.href+'/../sidebar-site.css');
            /* TODO: Does not work, due to the security protection
                     (http: -> file: linking).
            var l = navDoc.createElement('link');
            const DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
            var profDir = DIR.get('ProfD', Components.interfaces.nsIFile);
            const ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
            l.setAttribute ('href', ioService.newFileURI(profDir).spec+'chrome/navlinksidebar-site.css');
            */
            l.setAttribute('rel','stylesheet');
            navDoc.getElementsByTagName('head')[0].appendChild(l);
          },true);
        }
      }
      return true;
    }
  };
  var observerService = Components.classes[kObserverServiceIID].getService(Components.interfaces["nsIObserverService"]);
  observerService.addObserver(NavLoadObserver, "EndDocumentLoad", false);
  window.addEventListener("unload", function () {
    observerService.removeObserver(NavLoadObserver, "EndDocumentLoad", false);
  }, false);
}

/* Taken from Content Holder <http://white.sakura.ne.jp/~piro/xul/_contentholder.html>
   code */
var contentHolderDNDObserver =
{
	onDrop: function (aEvent, aXferData, aDragSession)
	{
		aEvent.preventDefault();
		aEvent.preventBubble();

		// "window.retrieveURLFromData()" is old implementation
		var url = 'retrieveURLFromData' in window ? retrieveURLFromData(aXferData.data, aXferData.flavour.contentType) : transferUtils.retrieveURLFromData(aXferData.data, aXferData.flavour.contentType) ;
		if (!url || !url.length || url.indexOf(' ', 0) != -1)
			return;
		
		document.getElementById('navBrowser').contentWindow.location.href = url;
	},

	getSupportedFlavours: function ()
	{
		var flavourSet = new FlavourSet();
		flavourSet.appendFlavour('text/x-moz-url');
		flavourSet.appendFlavour('text/unicode');
		flavourSet.appendFlavour('application/x-moz-file', 'nsIFile');
		return flavourSet;
	}
};

/* ***** BEGIN LICENSE BLOCK *****
 * Version: NPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Netscape Public License
 * Version 1.1 (the "License"); you may not use this file except in
 * compliance with the License. You may obtain a copy of the License at
 * http://www.mozilla.org/NPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is navLinkSidebar code.
 *
 * The Initial Developer of the Original Code is 
 * Wakaba <w@suika.fam.cx>.
 * Portions created by the Initial Developer are Copyright (C) 2003
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Wakaba <w@suika.fam.cx>
 *
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the NPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the NPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
