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
 * Portions created by the Initial Developer are Copyright (C) 2002
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



//const nsIPref = Components.interfaces.nsIPref;

// Run the startup function when the window loads
/* document.getElementById("prefbar").*/ window.addEventListener("load",startPrefBar, true); 


function startPrefBar(event)
{
	debugMessage("Starting prefbar...");

  window.removeEventListener("load",startPrefBar, true); // Keep the event from firing a hundred more times.

  document.getElementById("prefbar").addEventListener("unload" ,closePrefBar, false);

  checkForDataFile();

  loadDatasource(getProfileDir("prefbar.rdf"), "prefbar");

	setChecksInit();
}


function closePrefBar(event)
{
	/* All the following is a hack to prevent a crash on next boot if someone was spoofing IE.  See bug 83376.

	   This just resets the user agent to normal upon shutdown, which as an added bonus prevents you from 
	   forgetting that you changed it and sending the wrong UA everywhere for three weeks.

	   Somehow I have a feeling I will get lots of bug reports on this, even if I mention it in the User's Guide...
	*/

	debugMessage("Window closing...");

	var classID = Components.classes["@mozilla.org/rdf/datasource;1?name=window-mediator"];
	var windowMediator = classID.getService(Components.interfaces.nsIWindowMediator);
	var browserWindows = windowMediator.getXULWindowEnumerator("navigator:browser");


	if(browserWindows.hasMoreElements())  // There are still other browser windows open...
	{
		debugMessage("Not last window");
	}
	else
	{
		debugMessage("Last window.");

		var nsIPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService)
		prefBranch = nsIPref.getBranch("");

		if(prefBranch.prefHasUserValue("general.useragent.override"))
		{
			debugMessage("Removing user agent spoof.");

			prefBranch.clearUserPref("general.useragent.override");
		}
	}		
}


function setChecksInit()
{
  addEventListener("focus", setChecks, false);  // Reload the prefs whenever the window receives focus

  setTimeout("setChecks()", 500);  // Reload the prefs right now (well, 500ms from now)
}

function setChecks()
{
	debugMessage("Setting checks...");

	var Rtype    = RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#type");
	var Renabled = RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#enabled");

	var Ltrue     = RDF.GetLiteral("true");
	var Lcheckbox = RDF.GetLiteral("check");
	var Lbutton   = RDF.GetLiteral("button");
	var Lmenulist = RDF.GetLiteral("menulist");

	var checkboxes = myDatasource.GetSources(Rtype, Lcheckbox, true);

	while(checkboxes.hasMoreElements())
	{
		var box = checkboxes.getNext();
		var id = box.QueryInterface(Components.interfaces.nsIRDFResource).Value;

		if(myDatasource.HasAssertion(RDF.GetResource(id), Renabled, Ltrue, true))
     { 
			setCheck(id);
		}
	}


  /********* Hack to get rid of ghost buttons that accompany observing buttons ***********/
  /**************** Still doesn't fix the crash on new window problem ********************/
/*
	var buttons = myDatasource.GetSources(Rtype, Lbutton, true);

	while(buttons.hasMoreElements())
	{
		var button = buttons.getNext();
		var id = button.QueryInterface(Components.interfaces.nsIRDFResource).Value;

		if(myDatasource.HasAssertion(RDF.GetResource(id), Renabled, Ltrue, true))
     { 
			var dialogItem = document.getElementById(id);

			dialogItem.setAttribute("hidden", "true");
			dialogItem.removeAttribute("hidden");
		}
	}
*/


	/*********************** Setup Menulists *********************/

	var menulists = myDatasource.GetSources(Rtype, Lmenulist, true);

	while(menulists.hasMoreElements())
	{
		var menulist = menulists.getNext();
		var id = menulist.QueryInterface(Components.interfaces.nsIRDFResource).Value;

		if(myDatasource.HasAssertion(RDF.GetResource(id), Renabled, Ltrue, true))
     { 
			setMenulist(id);
		}
	}


}

function setCheck(itemId)
{
//	alert(itemId);
	var item = document.getElementById(itemId);
//	alert(item);

	var value = navigator.preference(item.getAttribute("prefstring")); // Value is magic variable referenced in prefstring

	debugMessage("Setting Check: " + itemId + " : " + value);

	item.setAttribute("checked",eval(item.getAttribute("frompref")));
}

function changePref(event)
{
//  var pref = Components.classes["@mozilla.org/preferences;1"].createInstance(nsIPref);  

  var item = event.target;
	var value = !item.checked;

  navigator.preference(item.getAttribute("prefstring"),eval(item.getAttribute("topref")));
}



function setMenulist(id)
{
	debugMessage("Setting menulist: " + id);

	var item = document.getElementById(id);

	var prefstring = item.getAttribute("prefstring");

	var nsIPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService)
	prefBranch = nsIPref.getBranch("");

	if(prefBranch.prefHasUserValue(prefstring))
	{
		var prefvalue = navigator.preference(prefstring);

		debugMessage("  Prefvalue: " + prefvalue);

		option = item.firstChild.firstChild;

		do
		{
			var value = option.getAttribute("value");   // Value is magic variable referenced in prefstring
			var listvalue = value; //eval(item.getAttribute("topref"));  // No need for topref in menulist?

			debugMessage("  Listvalue: " + listvalue);

			if(prefvalue == listvalue)
			{
				debugMessage("Equal!");
	
				item.selectedIndex = option.getAttribute("position"); // ****** HACK ******
				//item.firstChild.childNodes[option.getAttribute("position")].setAttribute("selected", "true");

/*				var event = document.createEvent('Events');
          event.initEvent('command', false, true);

				item.firstChild.childNodes[option.getAttribute("position")].dispatchEvent(event);
*/				return;
			}
		}	while(option = option.nextSibling);

	}
	else
	{
		item.selectedIndex = item.getAttribute("default");  // ****** HACK ******
		//item.firstChild.childNodes[item.getAttribute("default")].setAttribute("selected", "true");
//		item.firstChild.childNodes[item.getAttribute("default")].dispatchEvent(document.createEvent("click"));
	}

}






function goLink(url)
{
	loadURI(url);
}

function processMenulist(item)
{
	var nsIPref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService)
	prefBranch = nsIPref.getBranch("");

	var pref = item.getAttribute("prefstring");
	var value = item.selectedItem.getAttribute("value");
	var type = prefBranch.getPrefType(pref);

	if(type == prefBranch.PREF_STRING)
		prefBranch.setCharPref(pref, value);
	else if(type == prefBranch.PREF_INT)
		prefBranch. setIntPref(pref, Number(value));
	else if(type == prefBranch.PREF_BOOL)
		prefBranch.setBoolPref(pref, Boolean(value));
	else
		navigator.preference(pref, value);  // Couldn't hurt to try...


	if(value == "")
	{
		prefBranch.clearUserPref(pref);
	}
}

function togglePrefBar()
{
	if(navigator.userAgent.indexOf("Phoenix") == -1)
		togglePrefBarMozilla();
	else
		togglePrefBarPhoenix();
}

function togglePrefBarPhoenix()
{
    var toolbar = document.getElementById("prefbar");
    toolbar.collapsed = !toolbar.collapsed;
    setChecks();
}

function togglePrefBarMozilla()
{
  goToggleToolbar('prefbar','viewprefsbar');
  setChecks();
}