document.addEventListener("plusready", function() {
	var BLUETOOTH = 'PluginBluetooth',
		B = window.plus.bridge;
	var pluginbluetooth = {
		isBluetoothOpen: function() {
			return B.execSync(BLUETOOTH, "isBluetoothOpen", []);
		},
		scanStart: function(successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(BLUETOOTH, "scanStart", [callbackID]);
		},
		scanCancel: function() {
			return B.execSync(BLUETOOTH, "scanCancel", []);
		},
		initOptions: function() {
			return B.execSync(BLUETOOTH, "initOptions", []);
		},
		connectPeri: function(name,successCallback, errorCallback) {
			var success = typeof successCallback !== 'function' ? null : function(args) {
					successCallback(args);
				},
				fail = typeof errorCallback !== 'function' ? null : function(code) {
					errorCallback(code);
				};
			callbackID = B.callbackId(success, fail);
			return B.exec(BLUETOOTH, "connectPeri", [callbackID,name]);
		},
		disconnectPeri: function() {
			return B.execSync(BLUETOOTH, "disconnectPeri", []);
		}
	};
	window.plus.PluginBluetooth = pluginbluetooth;
	plus.PluginBluetooth.initOptions();
}, true);
