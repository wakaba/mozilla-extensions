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


function setupNew()
{

}

function setupEdit()
{
	var itemId = window.parent.arguments[0];
	setIdField(itemId);

	setField(itemId, "label",       "itemLabel");
	setField(itemId, "prefstring",  "itemPrefstring");

	setField(itemId, "optionlabel1",  "itemOptionLabel1");
	setField(itemId, "optionvalue1",  "itemOptionValue1");

	setField(itemId, "optionlabel2",  "itemOptionLabel2");
	setField(itemId, "optionvalue2",  "itemOptionValue2");

	setField(itemId, "optionlabel3",  "itemOptionLabel3");
	setField(itemId, "optionvalue3",  "itemOptionValue3");

	setField(itemId, "optionlabel4",  "itemOptionLabel4");
	setField(itemId, "optionvalue4",  "itemOptionValue4");

	setField(itemId, "optionlabel5",  "itemOptionLabel5");
	setField(itemId, "optionvalue5",  "itemOptionValue5");

	setField(itemId, "optionlabel6",  "itemOptionLabel6");
	setField(itemId, "optionvalue6",  "itemOptionValue6");
}

function verifyDataNew()
{
	if(!checkId(document.getElementById("itemId").value))
		return false;
	else
		return verifyData()
}

function verifyData()
{
	if(!attributeNotEmpty("Id",         "itemId"))             return false;
	if(!attributeNotEmpty("Label",      "itemLabel"))          return false;
	if(!attributeNotEmpty("Prefstring", "itemPrefstring"))     return false;

	return true;
}

function createNewItem()
{

	var RDF = window.parent.opener.RDF;
	var myDatasource = window.parent.opener.myDatasource;


	var Rbuttons = RDF.GetResource("urn:prefbar:buttons");
	var RitemId = RDF.GetResource("urn:prefbar:buttons:" + document.getElementById("itemId").value);

	var container = Components.classes["@mozilla.org/rdf/container;1"].getService(Components.interfaces.nsIRDFContainer);
	container.Init(myDatasource, Rbuttons);

	debugMessage("Inserting new item: urn:prefbar:buttons:" + document.getElementById("itemId").value);

	container.InsertElementAt(RitemId, 1, "true");

	myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#type"),         RDF.GetLiteral("menulist"),       true); 
	myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#label"),        getItemLiteral("itemLabel"),      true); 
	myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#prefstring"),   getItemLiteral("itemPrefstring"), true);
	myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#enabled"),      RDF.GetLiteral("false"),          true);

	for(var i=1;i<7;i++)
	{
		if(!fieldEmpty("itemOptionLabel" + i))
		{
			myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#optionlabel" + i), getItemLiteral("itemOptionLabel" + i), true);
			myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#optionvalue" + i), getItemLiteral("itemOptionValue" + i), true);
		}
	}

}

function editItem()
{
	debugMessage("Editing item...");

	var itemId = window.parent.arguments[0];
	var RitemId = RDF.GetResource(itemId);



	editField(itemId, "label",      "itemLabel");
	editField(itemId, "prefstring", "itemPrefstring");


	for(var i=1;i<7;i++)
	{
		removeField(itemId, "optionlabel" + i, "itemOptionLabel" + i);
		removeField(itemId, "optionvalue" + i, "itemOptionValue" + i);

		if(!fieldEmpty("itemOptionLabel" + i))
		{
			myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#optionlabel" + i), getItemLiteral("itemOptionLabel" + i), true);
			myDatasource.Assert(RitemId, RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#optionvalue" + i), getItemLiteral("itemOptionValue" + i), true);
		}
	}
}





