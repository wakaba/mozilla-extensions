/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Preferences Toolbar 2.
 *
 * The Initial Developer of the Original Code is
 * Aaron Andersen.
 * Portions created by the Initial Developer are Copyright (C) 2___
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): Aaron Andersen <aaron@xulplanet.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */


function clearHistory()
{
	var classID = Components.classes['@mozilla.org/browser/global-history;1'];
	var browserHistory = classID.getService(Components.interfaces.nsIBrowserHistory)
	browserHistory.removeAllPages();
}


function clearLocationBar()
{
	var classID = Components.classes['@mozilla.org/browser/urlbarhistory;1']
	var urlbarHistory = classID.getService(Components.interfaces.nsIUrlbarHistory)
	urlbarHistory.clearHistory();

	navigator.preference('general.open_location.last_url', '');
}


function clearCache(aType)
{
	var classID = Components.classes["@mozilla.org/network/cache-service;1"];
	var cacheService = classID.getService(Components.interfaces.nsICacheService);
	cacheService.evictEntries(aType);
}

function clearMemCache()
{
	clearCache(Components.interfaces.nsICache.STORE_IN_MEMORY);
}

function clearDiskCache()
{
	clearCache(Components.interfaces.nsICache.STORE_ON_DISK);
}

function clearAllCache()
{
	clearMemCache();
	clearDiskCache();
}

function killFlash()
{
	var page = document.getElementById("content").contentDocument;
	var flashes = page.getElementsByTagName("embed");

	for(i=0; i<flashes.length; i++)
	{
		var current = flashes[0];

		if(current.getAttribute("type") =="application/x-shockwave-flash")
		{
			var height = current.getAttribute("height");
			var width = current.getAttribute("width");

			if(current.parentNode.nodeName.toLowerCase() == "object")
			{
				top = current.parentNode.parentNode;
				next = current.parentNode;
			}
			else
			{
				top = current.parentNode;
				next = current;
			}

			if(height && width)
			{
				div = document.createElement("DIV");
				text = document.createTextNode(" ");
				div.appendChild(text);

				top.replaceChild(div, next);
			}
			else
			{
				top.removeChild(current);
			}

			div.setAttribute("style", "height: " + height + "px; width: " + width + "px; border: 1px solid black;");
//			div.setAttribute("align", "center");

			i--;
		}
	}
}
