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


var RDF = window.parent.opener.RDF;
var myDatasource = window.parent.opener.myDatasource;


function checkId(itemId)
{

	var RselItem = RDF.GetResource("urn:prefbar:buttons:" + itemId);

	var properties = myDatasource.ArcLabelsOut(RselItem);


	if(properties.hasMoreElements())
	{
		alert("Item Id alredy in use.  Use a different Id");

		return false;
	}
	else
	{
		return true;
	}
}

function attributeNotEmpty(label, edit)
{
	if(fieldEmpty(edit))
	{
		alert("No value entered for \"" + label + "\".  Please enter a value.");

		return false;
	}
	else
	{
		return true;
	}
}

function fieldEmpty(edit)
{
	return document.getElementById(edit).value == "";	
}

function getItemLiteral(fieldId)
{
	return RDF.GetLiteral(document.getElementById(fieldId).value);
}

function setIdField(itemId)
{
	itemIdShow = itemId.replace(/urn\:prefbar\:buttons:/g, "");

	var itemIdField = document.getElementById("itemId");

	itemIdField.value = itemIdShow
	itemIdField.disabled = "true";
}

function setField(itemId, attribute,  fieldId)
{
	var RitemId = RDF.GetResource(itemId);
	var Rattribute = RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#" + attribute);

	var Nvalue = myDatasource.GetTarget(RitemId, Rattribute, true);
	var value = Nvalue.QueryInterface(Components.interfaces.nsIRDFLiteral).Value;

	document.getElementById(fieldId).value = value;
}

function editField(itemId, attribute, fieldId)
{
	// Get Data
	var RitemId = RDF.GetResource(itemId);
	var Rattribute = RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#" + attribute);

	var NoldValue = myDatasource.GetTarget(RitemId, Rattribute, true);
	var LnewValue = getItemLiteral(fieldId);

	// Change RDF
	myDatasource.Change(RitemId, Rattribute, NoldValue, LnewValue);  

/*
	// Remove Old Data
	myDatasource.Unassert(RitemId, Rattribute, NoldValue, true);

	// Insert New Data
	myDatasource.Assert(RitemId, Rattribute, LnewValue);
*/
}

function removeField(itemId, attribute, fieldId)
{
	// Get Data
	var RitemId = RDF.GetResource(itemId);
	var Rattribute = RDF.GetResource("http://www.xulplanet.com/rdf/prefbar#" + attribute);


	if(myDatasource.hasArcOut(RitemId, Rattribute))
	{
		var NoldValue = myDatasource.GetTarget(RitemId, Rattribute, true);

		// Remove Old Data
		myDatasource.Unassert(RitemId, Rattribute, NoldValue, true);
	}
}









