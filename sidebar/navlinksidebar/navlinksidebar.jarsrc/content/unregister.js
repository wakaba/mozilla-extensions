/*
"exUnregisterer", the automatic unregisterer (Ver.0.3.2002092501) 

exapmle:

>var unreg = new exUnregisterer(
>		'chrome://my_app/content/contents.rdf',
>		'jar:resource:///chrome/my_app.jar!/locale/en-US/contents.rdf'
>	);
>
>unreg.unregister(); // unregister all files
>unreg.removePrefs('my_app'); // remove all prefs ('my_app.XXXX.XXXXX', 'my_app.YYYY.ZZZZ', and so on)


This class has following properties and methods:

installedPath : the URI of the chrome directory in Mozilla installed.
unregister() : executes unregisteration.
removePrefs(aBranch) : removes all preferences which include the handled name.
readFrom(aFile) : reads a text file and returns the content as a string.
writeTo(aFile, aContent) : writes a text file with a string.




Mozilla には現在、インストールしたパッケージを自動で削除する機能が
なく、アンインストールは手動で行わなければなりません。具体的には、
chrome.rdfからの登録の解除と、 overlayinfo 内にある overlays.rdf か
らの登録の解除を行うことになります。

これらのファイルは RDF で記述されているので、 XPCOM の RDF 関連の機
能で内容を編集することができます。また、 contents.rdf から登録情報を
集めれば、上記の手順を自動化することもできます。というわけで、実際に
contents.rdf を解釈してアンインストールを行うクラスを作ってみました。
使い方は前述の通りです。


*/

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
 * The Original Code is the exUnregisterer.
 *
 * The Initial Developer of the Original Code is SHIMODA Hiroshi.
 * Portions created by the Initial Developer are Copyright (C) 2002
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s): SHIMODA Hiroshi <piro@p.club.ne.jp>
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



function exUnregisterer()
{
	this.init(arguments);
	delete this.mTarget.overlaysTemp;
}

exUnregisterer.prototype =
{
	
	// properties 
	
	mTarget : 
	{
		packages : [],
		locales  : [],
		skins    : [],
		overlays : [],
		overlaysTemp : []
	},
 
	mEntriesURL : [], 
 
	get installedPath() 
	{
		if (!this._installedPath) {
			this._installedPath = this.getURI('AChrom');
			if (!this._installedPath.match(/\/$/)) this._installedPath += '/';
		}
		return this._installedPath;
	},
	_installedPath : null,
 
	get RDF() 
	{
		if (!this._RDF) {
			this._RDF = Components.classes['@mozilla.org/rdf/rdf-service;1'].getService(Components.interfaces.nsIRDFService);
		}
		return this._RDF;
	},
	_RDF : null,
 
	get RDFC() 
	{
		if (!this._RDFC) {
			this._RDFC = Components.classes['@mozilla.org/rdf/container;1'].createInstance(Components.interfaces.nsIRDFContainer);
		}
		return this._RDFC;
	},
	_RDFC : null,
  
	// Initialize 
	init : function(aDsourcePaths)
	{
		var rootnode =
			{
				packages : 'urn:mozilla:package:root',
				locales  : 'urn:mozilla:locale:root',
				skins    : 'urn:mozilla:skin:root',
				overlays : 'urn:mozilla:overlays'
			},
			dsource,
			i,
			nodes,
			node,
			target;

		for (var j = 0; j < aDsourcePaths.length; j++)
		{

			try {
				if (this.RDF.GetDataSourceBlocking)
					dsource = this.RDF.GetDataSourceBlocking(aDsourcePaths[j]).QueryInterface(Components.interfaces.nsIRDFDataSource);
				else
					dsource = this.RDF.GetDataSource(aDsourcePaths[j]);
			}
			catch(e) {
				continue;
			}

			for (i in rootnode)
			{
				try {
					this.RDFC.Init(dsource, this.RDF.GetResource(rootnode[i]));
				}
				catch(e) {
					continue;
				}

				nodes = this.RDFC.GetElements();
				while (nodes.hasMoreElements())
				{
					node = nodes.getNext();
					node = node.QueryInterface(Components.interfaces.nsIRDFResource);
					target = node.Value;
					switch(i)
					{
						case 'locales':
						case 'skins':
							target += ':packages';
							if (!this.mTarget[i][target])
								this.mTarget[i][target] = [];
							break;

						case 'overlays':
							if (!this.mTarget[i+'Temp'][target])
								this.mTarget[i+'Temp'][target] = [];
							break;

						default:
							this.mTarget[i][target] = true;
							break;
					}
				}
			}


			var targets =
				[
					this.mTarget.locales,
					this.mTarget.skins
				];
			for (var k in targets)
			{
				for (i in targets[k])
				{
					try {
						this.RDFC.Init(dsource, this.RDF.GetResource(i));
					}
					catch(e) {
						continue;
					}
					nodes = this.RDFC.GetElements();
					while (nodes.hasMoreElements())
					{
						node = nodes.getNext();
						node = node.QueryInterface(Components.interfaces.nsIRDFResource);
						targets[k][i][node.Value] = true;
					}
				}
			}

			// overlays
			for (i in this.mTarget.overlaysTemp)
			{
				try {
					this.RDFC.Init(dsource, this.RDF.GetResource(i));
				}
				catch(e) {
					continue;
				}
				nodes = this.RDFC.GetElements();
				while (nodes.hasMoreElements())
				{
					node = nodes.getNext();
					node = node.QueryInterface(Components.interfaces.nsIRDFLiteral);
					target = i.replace(/[^:]+:\/\/([^\/]+).+/, 'overlayinfo/$1/content/overlays.rdf');
					if (!this.mTarget.overlays[target])
						this.mTarget.overlays[target] = [];
					if (!this.mTarget.overlays[target][i])
						this.mTarget.overlays[target][i] = [];
					this.mTarget.overlays[target][i][node.Value] = true;
				}
			}

		}

		return;
	},
	
	// Get an URI from an internal keyword 
	getURI : function(aKeyword)
	{
		const DIR = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
		var dir = DIR.get(aKeyword, Components.interfaces.nsIFile),
			path;

		const ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
		try {
			path = ioService.newFileURI(dir).spec;
		}
		catch(e) { // [[interchangeability for Mozilla 1.1]]
			path = ioService.getURLSpecFromFile(dir);
		}

		return path;
	},
 
	// Convert an URI to a file path 
	getFilePathFromURI : function(aURI)
	{
		var URI = Components.classes['@mozilla.org/network/standard-url;1'].createInstance(Components.interfaces.nsIURI);
			URI.spec = aURI;

		if (!URI.schemeIs('file')) return '';

		var tempLocalFile;
		const ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
		try {
			var fileHandler = ioService.getProtocolHandler('file').QueryInterface(Components.interfaces.nsIFileProtocolHandler);
			tempLocalFile = fileHandler.getFileFromURLSpec(aURI);
		}
		catch(e) { // [[interchangeability for Mozilla 1.1]]
			try {
				tempLocalFile = ioService.getFileFromURLSpec(aURI);
			}
			catch(ex) { // [[interchangeability for Mozilla 1.0.x]]
				tempLocalFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
				ioService.initFileFromURLSpec(tempLocalFile, aURI);
			}
		}
		return tempLocalFile.path;
	},
  
	// Unregister information 
	unregister : function()
	{

		// packages unregisteration
		for (i in this.mTarget.packages)
		{
			this.removeResources(this.installedPath+'chrome.rdf', 'urn:mozilla:package:root', this.mTarget.packages);
			this.removeResources(this.installedPath+'all-packages.rdf', 'urn:mozilla:package:root', this.mTarget.packages);
		}

		// locales unregistration
		for (i in this.mTarget.locales)
		{
			this.removeResources(this.installedPath+'chrome.rdf', i, this.mTarget.locales[i]);
			this.removeResources(this.installedPath+'all-locales.rdf', i, this.mTarget.locales[i]);
		}

		// skins unregistration
		for (i in this.mTarget.skins)
		{
			this.removeResources(this.installedPath+'chrome.rdf', i, this.mTarget.skins[i]);
			this.removeResources(this.installedPath+'all-skins.rdf', i, this.mTarget.skins[i]);
		}

		// overlays unregistration
		for (i in this.mTarget.overlays)
			for (j in this.mTarget.overlays[i])
				this.removeResources(this.installedPath+i, j, this.mTarget.overlays[i][j]);



		// remove entries from installed-chrome.txt
		var installedChrome = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
		installedChrome.initWithPath(this.getFilePathFromURI(this.installedPath+'installed-chrome.txt'));

		var entries = this.readFrom(installedChrome);
		for (i in this.mEntriesURL)
			entries = entries.replace(new RegExp('[^\\n\\r]+'+this.mEntriesURL[i]+'[\\n\\r]+', 'g'), '');
		this.writeTo(installedChrome, entries);


		return;
	},
	
	// Remove info from RDF files 
	removeResources : function(aDsourcePath, aRootURI, aTargets)
	{
		var dsource = this.RDF.GetDataSource(aDsourcePath);
			dsource = dsource.QueryInterface(Components.interfaces.nsIRDFDataSource);

		try {
			this.RDFC.Init(dsource, this.RDF.GetResource(aRootURI));
		}
		catch(e) {
//			dump('ERROR: cannot remove resources in '+rootnode);
			return;
		}

		var nodes = this.RDFC.GetElements(),
			node,
			removenode,
			removenodes = [],
			removename,
			removenames,
			removevalue;

		while (nodes.hasMoreElements())
		{
			node = nodes.getNext();
			try {
				node = node.QueryInterface(Components.interfaces.nsIRDFResource);
			}
			catch(e) {
				node = node.QueryInterface(Components.interfaces.nsIRDFLiteral);
			}

			if (!node || (aTargets && !aTargets[node.Value])) continue;

			try {
				removenode = (aDsourcePath.match(/overlays\.rdf$/)) ? this.RDF.GetLiteral(node.Value) : this.RDF.GetResource(node.Value) ;

				removenodes.push(removenode);

				// If the file is "overlays.rdf", then this block is skipped.
				try {
					removenames = dsource.ArcLabelsOut(removenode);
					while (removenames.hasMoreElements())
					{
						removename = removenames.getNext().QueryInterface(Components.interfaces.nsIRDFResource);
						removevalue = dsource.GetTarget(removenode, removename, true);
						if (removename.Value.match(/#baseURL$/))
							this.mEntriesURL.push(removevalue.QueryInterface(Components.interfaces.nsIRDFLiteral).Value);

						dsource.Unassert(removenode, removename, removevalue);
					}
				}
				catch(e) {
				}
			}
			catch(e) {
//				dump('cannot remove '+node.Value+' from '+rooturi);
			}
		}

		for (var i in removenodes)
			this.RDFC.RemoveElement(removenodes[i], true);

		dsource.QueryInterface(Components.interfaces.nsIRDFRemoteDataSource).Flush();
		return;
	},
  
	// Remove all user preferences containing the argument "branch" in the top of the name. 
	removePrefs : function(aBranch)
	{
		//const PREF = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService).getBranch(branch+'.');
		const PREF = Components.classes['@mozilla.org/preferences;1'].getService(Components.interfaces.nsIPrefBranch);

		try {
			var prefs = PREF.getChildList(aBranch+'.', { value: 0 });
			for (var i in prefs) PREF.clearUserPref(prefs[i]);
		}
		catch(e) {
//			dump('ERROR: cannot clear user preferences.');
		}

		return;
	},
 
	// File I/O 
	
	readFrom : function(aFile) 
	{
		var stream = Components.classes['@mozilla.org/network/file-input-stream;1'].createInstance(Components.interfaces.nsIFileInputStream);
		stream.init(aFile, 1, 0, false); // open as "read only"

		var scriptableStream = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
		scriptableStream.init(stream);

		var fileSize = scriptableStream.available();
		var fileContents = scriptableStream.read(fileSize);

		scriptableStream.close();
		stream.close();

		return fileContents;
	},
 
	writeTo : function(aFile, aContent) 
	{
		if (aFile.exists()) aFile.remove(true);
		aFile.create(aFile.NORMAL_FILE_TYPE, 0666);

		var stream = Components.classes['@mozilla.org/network/file-output-stream;1'].createInstance(Components.interfaces.nsIFileOutputStream);
		stream.init(aFile, 2, 0x200, false); // open as "write only"

		stream.write(aContent, aContent.length);

		stream.close();
	}
   
} 
 
