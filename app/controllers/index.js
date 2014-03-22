/**
 * @class Controllers
 */

// App bootstrap
var App = require("core");

// Add items to the global namespace
App.globalWindow = $.globalWindow;

// Initialize the application
App.init();

// Check for iOS 7, push down window to account for status bar under-scroll if needed
if(OS_IOS && App.Device.versionMajor >= 7) {
	App.globalWindow.top = 20;
}

App.openScreen("main");