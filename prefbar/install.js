// XulPlanet Install Script
// Preferences Toolbar 2.2.1
// Aaron Andersen, 20030226

kappName = "Preferences Toolbar";
kappVersion = "2.2.1";
kappChromeName = "prefbar";
kappFile = "prefbar.jar";
kappPath = "content/prefbar/";
klocalePath = "locale/en-US/prefbar/";
ksuccessMessage = "The Preferences Toolbar has been successfully installed.  Restart your browser to continue.";
kerrorMessage   = "Install failed!  You probably don't have appropriate permissions (write access to the mozilla/chrome directory.)";

initInstall(kappName, "xulplanet/" + kappChromeName, kappVersion); 

addFile(kappName, kappFile,       getFolder("Chrome"),"");
addFile(kappName, "prefbar.rdf" , getFolder("Profile") , "")
		
registerChrome(CONTENT | DELAYED_CHROME, getFolder("Chrome", kappFile), kappPath);
registerChrome(LOCALE  | DELAYED_CHROME, getFolder("Chrome", kappFile), klocalePath);

var err = getLastError();

if (err == SUCCESS)
{
  err = performInstall();

  if (err == SUCCESS)
  {
    alert(ksuccessMessage);
  }
  else
  {
    alert(kerrorMessage);
    cancelInstall(err)
  }
}
else
  cancelInstall(err);