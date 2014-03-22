/**
 * Stack-based navigation module which manages the navigation state and such for an app.
 * This particular module manages a stack of views added to a specific parent
 * most common in a one-window architecture.
 *
 * @class Navigation
 */

/**
 * The Navigation object
 * @param {Object} _args
 * @constructor
 */
function Navigation(_args) {
	_args = _args || {};

	/**
	 * Whether or not the navigation module is busy opening/closing a screen
	 * @type {Boolean}
	 */
	this.isBusy = false;

	/**
	 * The controller stack
	 * @type {Array}
	 */
	this.controllers = [];

	/**
	 * The current controller object reference
	 * @type {Controllers}
	 */
	this.currentController = null;

	/**
	 * The parent object all screen controllers are added to
	 * @type {Object}
	 */
	this.parent = _args.parent;

	/**
	 * Open a screen controller
	 * @param {String} _controller
	 * @param {Object} _controllerArguments The arguments for the controller (optional)
	 * @return {Controllers} Returns the new controller
	 */
	this.open = function(_controller, _controllerArguments) {
		var that = this;

		if(that.isBusy) {
			return;
		}

		that.isBusy = true;

		var controller = Alloy.createController(_controller, _controllerArguments);

		// Handle removing the current controller from the screen
		if(that.currentController) {
			that.parent.remove(that.currentController.wrapper);
		}

		that.controllers.push(controller);

		that.currentController = controller;

		that.parent.add(that.currentController.wrapper);

		// Handle if the current controller has an override way of opening itself
		if(that.currentController.open) {
			that.currentController.open();

			that.isBusy = false;
		} else {
			that.isBusy = false;
		}

		that.testOutput();

		return that.currentController;
	};

	/**
	 * Close the controller at the top of the stack
	 * @param {Function} _callback
	 */
	this.close = function(_callback) {
		var that = this;

		if(that.isBusy) {
			return;
		}

		that.isBusy = true;

		var outgoingController = that.currentController;
		var incomingController = that.controllers[that.controllers.length - 2];

		// Animate in the previous controller
		if(incomingController) {
			that.parent.add(incomingController.wrapper);

			if(incomingController.open) {
				incomingController.open();

				that.isBusy = false;
			} else {
				that.isBusy = false;
			}
		}

		that.parent.remove(outgoingController.wrapper);
		that.controllers.pop();

		outgoingController = null;

		// Assign the new current controller from the stack
		that.currentController = that.controllers[that.controllers.length - 1];

		if(_callback) {
			_callback();
		}

		// that.testOutput();
	};

	/**
	 * Close all controllers except the first in the stack
	 * @param {Function} _callback
	 */
	this.closeToHome = function(_callback) {
		var that = this;

		if(that.isBusy) {
			return;
		}

		that.isBusy = true;

		var outgoingController = that.currentController;
		var incomingController = that.controllers[0];

		// Animate in the previous controller
		if(incomingController) {
			that.parent.add(incomingController.wrapper);

			if(incomingController.open) {
				incomingController.open();

				that.isBusy = false;
			} else {
				that.isBusy = false;
			}
		}

		that.parent.remove(outgoingController.wrapper);
		that.controllers.splice(1, that.controllers.length - 1);

		outgoingController = null;

		// Assign the new current controller from the stack
		that.currentController = that.controllers[0];

		if(_callback) {
			_callback();
		}

		// that.testOutput();
	};

	/**
	 * Close all controllers
	 */
	this.closeAll = function() {
		var that = this;

		for(var i = 0, x = that.controllers.length; i < x; i++) {
			that.parent.remove(that.controllers[i].wrapper);
		}

		that.controllers = [];
		that.currentController = null;

		// that.testOutput();
	};

	/**
	 * Spits information about the navigation stack out to console
	 */
	this.testOutput = function() {
		var that = this;

		var stack = [];

		for(var i = 0, x = that.controllers.length; i < x; i++) {
			if(that.controllers[i].wrapper.controller) {
				stack.push(that.controllers[i].wrapper.controller);
			}
		}

		Ti.API.debug("Stack Length: " + that.controllers.length);
		Ti.API.debug(JSON.stringify(stack, null, 4));
	};
}

// Calling this module function returns a new navigation instance
module.exports = function(_args) {
	return new Navigation(_args);
};