var err = initInstall("navLinkSidebar 0.0.1", "navLinkSidebar", "0.0.1"); 
logComment("initInstall: " + err);

addFile("Navigation page Sidebar Panel",
  "navLinkSidebar.jar",	// jar source folder 
  getFolder("Chrome"),	// target folder
  "");	// target subdir 

registerChrome(PACKAGE | DELAYED_CHROME, getFolder("Chrome","navLinkSidebar.jar"), "content/");

if (err==SUCCESS)
  performInstall(); 
else
  cancelInstall(err);
