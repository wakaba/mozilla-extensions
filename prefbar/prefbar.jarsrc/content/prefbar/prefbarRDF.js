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


// Globals
var RDF = null;
var myDatasource = null;


/*******************  Customization Stuff ********************/

function checkForDataFile()
{
	// hack becasue I can't seem to get an nsIFile for the data file directly;

	var dirService = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);

	var profDir = dirService.get("ProfD", Components.interfaces.nsIFile);

	var target = profDir.clone();
	target.append("prefbar.rdf");

	
	// No one should ever click "No" to this dialog.  Perhaps I should remove it.

	if(!target.exists() /* && confirm("Your PrefBar data file seems to be missing.  Rebuild from default?") */)
	{
		var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

		// Thanks to Matt Kennedy for this code!

		const FILE_OUTPUT_STREAM = "@mozilla.org/network/file-output-stream;1";
		const nsIFileOutputStream = Components.interfaces.nsIFileOutputStream;

		target.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0600);

		var channel = ioservice.newChannel("chrome://prefbar/content/prefbar.rdf", null, null);
		var istream = channel.open();
		var ostream = Components.classes[FILE_OUTPUT_STREAM].createInstance(nsIFileOutputStream);

		var scriptstream = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
		scriptstream.init(istream);

		var len = scriptstream.available();
		var buffer = scriptstream.read(len);

		ostream.init(target, 0x08 | 0x02, 0600, 0);
		ostream.write(buffer, len);

		ostream.close(); 
		istream.close();
		scriptstream.close();
	}
}


function loadDatasource(datasource, element)
{
  RDF = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
  myDatasource = RDF.GetDataSource(datasource);

  attachTo = document.getElementById(element);

  attachTo.database.AddDataSource(myDatasource);
  attachTo.builder.rebuild();
}


function getProfileDir(subdir)
{

  var dirService = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);

  var profDir = dirService.get("ProfD", Components.interfaces.nsIFile);

  var service = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);


	// Fix for 1.2
	if("getURLSpecFromFile" in service)
 		return service.getURLSpecFromFile(profDir) + subdir;
	else
	{
		var fileHandler = service.getProtocolHandler("file").QueryInterface(Components.interfaces.nsIFileProtocolHandler);
		
		return fileHandler.getURLSpecFromFile(profDir) + subdir;
	}
}

function flushDatabase()
{
  remoteControll = myDatasource.QueryInterface(Components.interfaces.nsIRDFRemoteDataSource);
  remoteControll.Flush();
}


function flashElement(element)
{
  if(element.getAttribute("hidden") != "true")
  {
    element.setAttribute("hidden", "true");
    //alert("flashing...");
    element.removeAttribute("hidden");
  }
}

