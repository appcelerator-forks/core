/**
 * Sample controller
 * @class Controllers.main
 * @uses core
 */

var App = require("core");

/**
 * Listen for click event on Core.js logo, open sub screen
 */
$.logo.addEventListener("click", function(_event) {
	App.openScreen("sub");
});