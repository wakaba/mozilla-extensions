var err = initInstall("navLinkSidebar 1.1", "navLinkSidebar", "1.1"); 
logComment("initInstall: " + err);

addFile("Navigation page Sidebar Panel",
  "navlinksidebar.jar",	// jar source folder 
  getFolder("Chrome"),	// target folder
  "");	// target subdir 

registerChrome(PACKAGE | DELAYED_CHROME, getFolder("Chrome","navlinksidebar.jar"), "content/");

if (err==SUCCESS)
  performInstall(); 
else
  cancelInstall(err);
