/*
 * This file is auto-generated (at 2004-07-10T07:33:50Z).
 * Do not edit by hand!
 */

const PACKAGE_NAME = 'LiveHTTPHeaders 0.9 日本語パック';
const PACKAGE_VERSION = '1.4 (2004-07-10T07:33:50Z)';
const DISPLAY_NAME = 'LiveHTTPHeaders 0.9 日本語パック 1.4 (2004-07-10T07:33:50Z)';

const PACKAGE_JAR_DIRECTORY = 'chrome/';
const PACKAGE_JAR_FILENAME = 'livehttpheaders-ja.jar';
var PACKAGE_CONTENT_DIR = new Array ();
var PACKAGE_LOCALE_DIR = new Array ("locale/ja-JP/livehttpheaders/");

var err = initInstall (DISPLAY_NAME, PACKAGE_NAME, PACKAGE_VERSION); 
var messages = loadResources ('install-res.en.inf');

var contentFlag = CONTENT | DELAYED_CHROME;
var localeFlag = LOCALE | DELAYED_CHROME;
var UChrome = getFolder ('Chrome');
var existsInProfile = File.exists (getFolder (getFolder('Current User', 'chrome'), PACKAGE_JAR_DIRECTORY + PACKAGE_JAR_FILENAME));

if (existsInProfile || !confirm (messages.installToChrome)) {
  UChrome = getFolder ('Current User', 'chrome');
  contentFlag = CONTENT | PROFILE_CHROME;
  localeFlag  = LOCALE | PROFILE_CHROME;
}
logComment('initInstall: ' + err);
setPackageFolder (UChrome);
var folder = getFolder (UChrome, PACKAGE_JAR_FILENAME);

resetError ();
addFile (PACKAGE_NAME, PACKAGE_JAR_DIRECTORY + PACKAGE_JAR_FILENAME, UChrome, '');
err = getLastError ();
if (err == SUCCESS || err == REBOOT_NEEDED) {
  for (var i = 0; i < PACKAGE_CONTENT_DIR.length; i++) {
    registerChrome (contentFlag, folder, PACKAGE_CONTENT_DIR[i]);
  }
  for (var i = 0; i < PACKAGE_LOCALE_DIR.length; i++) {
    registerChrome (localeFlag, folder, PACKAGE_LOCALE_DIR[i]);
  }
}

err = getLastError();
if (err == SUCCESS || err == REBOOT_NEEDED) {
  performInstall();
  err = getLastError();
  if (err == SUCCESS || err == REBOOT_NEEDED) {
    //alert("Please restart mozilla");
  } else {
    // Nothing to do, Mozilla will display an error message himself
  }
} else {
  cancelInstall();
  if (err == -202) {
    alert (messages.noPermission.replace (/%s/, folder));
  } else if (err == -210) {
    alert (messages.canceldByUser);
  }else {
    alert(messages.unknownError.replace (/%s/, err));
  }
}

/*
***** BEGIN LICENSE BLOCK *****
Version: MPL 1.1/GPL 2.0/LGPL 2.1

The contents of this file are subject to the Mozilla Public License Version
1.1 (the "License"); you may not use this file except in compliance with
the License. You may obtain a copy of the License at 
<http://www.mozilla.org/MPL/>

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
for the specific language governing rights and limitations under the
License.

The Initial Developer is Wakaba <w@suika.fam.cx>.
Portions created by the Initial Developer are Copyright (C) 2003
the Initial Developer. All Rights Reserved.

Contributor(s):
	Wakaba <w@suika.fam.cx> (original author)

Alternatively, the contents of this file may be used under the terms of
either the GNU General Public License Version 2 or later (the "GPL"), or
the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
in which case the provisions of the GPL or the LGPL are applicable instead
of those above. If you wish to allow use of your version of this file only
under the terms of either the GPL or the LGPL, and not to allow others to
use your version of this file under the terms of the MPL, indicate your
decision by deleting the provisions above and replace them with the notice
and other provisions required by the GPL or the LGPL. If you do not delete
the provisions above, a recipient may use your version of this file under
the terms of any one of the MPL, the GPL or the LGPL.

***** END LICENSE BLOCK *****
*/
/* $Date: 2012/01/14 07:46:31 $ */
