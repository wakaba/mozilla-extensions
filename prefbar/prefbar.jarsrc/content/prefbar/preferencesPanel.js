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




function setupEverything()
{
	parent.initPanel('chrome://prefbar/content/preferencesPanel.xul');

	showInLeftTree();

  loadDatasource(getProfileDir("prefbar.rdf"), "enabledTree");
  loadDatasource(getProfileDir("prefbar.rdf"), "allTree");
}

function showInLeftTree()
{
	parent.document.getElementById("advancedItem").setAttribute("open", "true");
}

function selectEnabledTree()
{
	allTree = document.getElementById("allTree");

	// Remove selection from other tree
	// allTree.currentIndex = -1;       // This doesn't work
	allTree.view.selection.select(-1);  // So we use XPCOM


	// Disable Enable button
	document.getElementById("itemEnable").setAttribute("disabled", "true");

	// Enable Disable button
	document.getElementById("itemDisable").removeAttribute("disabled");


	// Enable Edit button
	document.getElementById("itemEdit").removeAttribute("disabled");

	// Enable Delete button
	document.getElementById("itemDelete").removeAttribute("disabled");


	setUpAndDownButtons("enabledTree");
}

function selectAllTree()
{
	enabledTree = document.getElementById("enabledTree");

	// Remove selection from other tree
	// enabledTree.currentIndex == -1;      // This doesn't work
	enabledTree.view.selection.select(-1);  // So we use XPCOM

	// Enable Enable button
	document.getElementById("itemEnable").removeAttribute("disabled");

	// Disable Disable button
	document.getElementById("itemDisable").setAttribute("disabled", "true");


	// Enable Edit button
	document.getElementById("itemEdit").removeAttribute("disabled");

	// Enable Delete button
	document.getElementById("itemDelete").removeAttribute("disabled");


	setUpAndDownButtons("allTree");
}

function setUpAndDownButtons(treeId)
{
	var tree = document.getElementById(treeId);
	var selection = tree.view.selection.currentIndex;


	// Set Up button
	if(selection == 0) // If we are selecting the very first item
		document.getElementById("itemMoveUp").setAttribute("disabled", "true");
	else
		document.getElementById("itemMoveUp").removeAttribute("disabled");


	// Set down button
	if(selection == tree.view.rowCount-1) // If we are selecting the very last item...
		document.getElementById("itemMoveDown").setAttribute("disabled", "true");
	else
		document.getElementById("itemMoveDown").removeAttribute("disabled");
}

function itemEnable()
{
	var allTree     = document.getElementById("allTree");

	if(allTree.view.rowCount == 1) // Workaround for empty template bug
	{
		alert("You cannot enable every button available. (template bug)");
		return;
	}

	var selection = allTree.view.selection.currentIndex;
	var itemId = allTree.treeBoxObject.treeBody.childNodes[selection].getAttribute("id");


	var Renabled = RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#enabled");
	var Ltrue    = RDF.GetLiteral("true");
	var Lfalse   = RDF.GetLiteral("false");

	myDatasource.Change(RDF.GetResource(itemId), Renabled, Lfalse, Ltrue);

//	allTree.builder.rebuild();
//	enabledTree.builder.rebuild();	
}


function itemDisable()
{
	var enabledTree = document.getElementById("enabledTree");

	if(enabledTree.view.rowCount == 1) // Workaround for empty template bug
	{
		alert("You cannot disable every button available. (template bug)");
		return;
	}

	var selection = enabledTree.view.selection.currentIndex;
	var itemId = enabledTree.treeBoxObject.treeBody.childNodes[selection].getAttribute("id");


	var Renabled = RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#enabled");
	var Ltrue    = RDF.GetLiteral("true");
	var Lfalse   = RDF.GetLiteral("false");

	myDatasource.Change(RDF.GetResource(itemId), Renabled, Ltrue, Lfalse);
}


function itemMoveUp()
{
	var allTree     = document.getElementById("allTree");
	var enabledTree = document.getElementById("enabledTree");
	var activeTree = (allTree.currentIndex != -1) ? allTree : enabledTree;

	var selection = activeTree.view.selection.currentIndex;
	var topItemId = activeTree.treeBoxObject.treeBody.childNodes[selection-1].getAttribute("id");
	var selItemId = activeTree.treeBoxObject.treeBody.childNodes[selection].getAttribute("id");


	swapElements(topItemId, selItemId);

	activeTree.view.selection.select(selection-1);
}

function itemMoveDown()
{
	var allTree     = document.getElementById("allTree");
	var enabledTree = document.getElementById("enabledTree");
	var activeTree = (allTree.currentIndex != -1) ? allTree : enabledTree;

	var selection = activeTree.view.selection.currentIndex;
	var selItemId = activeTree.treeBoxObject.treeBody.childNodes[selection].getAttribute("id");
	var btmItemId = activeTree.treeBoxObject.treeBody.childNodes[selection+1].getAttribute("id");


	swapElements(selItemId, btmItemId);

	activeTree.view.selection.select(selection+1);
}

function swapElements(idOne, idTwo)
{
	var Rbuttons = RDF.GetResource("urn:prefbar:buttons");
	var RitemOne = RDF.GetResource(idOne);
	var RitemTwo = RDF.GetResource(idTwo);


	var container = Components.classes["@mozilla.org/rdf/container;1"].getService(Components.interfaces.nsIRDFContainer);
	container.Init(myDatasource, Rbuttons);

	var indexOne = container.IndexOf(RitemOne);
	var indexTwo = container.IndexOf(RitemTwo);

	if(indexOne > indexTwo)
	{
		temp = indexOne;
		indexOne = indexTwo
		indexTwo = temp
	}

	container.RemoveElementAt(indexOne, false);
	container.RemoveElementAt(indexTwo, false);

	container.InsertElementAt(RitemTwo, indexOne, false);
	container.InsertElementAt(RitemOne, indexTwo, true);
}

function itemNew()
{
	window.openDialog("chrome://prefbar/content/newItem/newItem.xul", "newItemDialog", "chrome,titlebar,dialog,modal,resizable");

  // BUG: This only works if the enabled tree is already selected when the user click the new button.
	document.getElementById("enabledTree").view.selection.select(0);
}

function itemEdit()
{
	var allTree     = document.getElementById("allTree");
	var enabledTree = document.getElementById("enabledTree");
	var activeTree = (allTree.currentIndex != -1) ? allTree : enabledTree;

	var selection = activeTree.view.selection.currentIndex;
	var selItemId = activeTree.treeBoxObject.treeBody.childNodes[selection].getAttribute("id");

	window.openDialog("chrome://prefbar/content/newItem/editItem.xul", "editItemDialog", "chrome,titlebar,dialog,modal,resizable", selItemId);
}


function itemDelete()
{
	if(!confirm("Are you sure you want to delete this item?"))
	{
		return;
	}

	var allTree     = document.getElementById("allTree");
	var enabledTree = document.getElementById("enabledTree");
	var activeTree = (allTree.currentIndex != -1) ? allTree : enabledTree;

	var selection = activeTree.view.selection.currentIndex;
	var selItemId = activeTree.treeBoxObject.treeBody.childNodes[selection].getAttribute("id");

	var RselItem = RDF.GetResource(selItemId);
	var Rbuttons = RDF.GetResource("urn:prefbar:buttons");


	var properties = myDatasource.ArcLabelsOut(RselItem);

	while(properties.hasMoreElements())
	{
		var Rproperty = properties.getNext();

		var Lvalue = myDatasource.GetTarget(RselItem, Rproperty, true);
		myDatasource.Unassert(RselItem, Rproperty, Lvalue);
	}


	var container = Components.classes["@mozilla.org/rdf/container;1"].getService(Components.interfaces.nsIRDFContainer);
	container.Init(myDatasource, Rbuttons);

	container.RemoveElement(RselItem, true);
}




function writeToDisk()
{
  flushDatabase();
}