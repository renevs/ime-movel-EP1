/*global cordova*/
module.exports = {

    connect: function (macAddress, success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "connect", [macAddress]);
    },

    // Android only - see http://goo.gl/1mFjZY
    connectInsecure: function (macAddress, success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "connectInsecure", [macAddress]);
    },

    disconnect: function (macAddress, success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "disconnect", [macAddress]);
    },

    disconnectAll: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "disconnectAll", []);
    },

    // list bound devices
    list: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "list", []);
    },

    isEnabled: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "isEnabled", []);
    },

    isConnected: function (macAddress, success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "isConnected", [macAddress]);
    },

    listConnected: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "listConnected", []);
    },

    // the number of bytes of data available to read is passed to the success function
    available: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "available", []);
    },

    // read all the data in the buffer
    read: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "read", []);
    },

    // reads the data in the buffer up to and including the delimiter
    readUntil: function (delimiter, success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "readUntil", [delimiter]);
    },

    // writes data to the bluetooth serial port
    // data can be an ArrayBuffer, string, integer array, or Uint8Array
    write: function (macAddress, data, success, failure) {

        // convert to ArrayBuffer
        if (typeof data === 'string') {
            data = stringToArrayBuffer(data);
        } else if (data instanceof Array) {
            // assuming array of interger
            data = new Uint8Array(data).buffer;
        } else if (data instanceof Uint8Array) {
            data = data.buffer;
        }

        cordova.exec(success, failure, "BluetoothSerialUniversal", "write", [macAddress, data]);
    },

    // calls the success callback when new data is available
    subscribe: function ( success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "subscribe", []);
    },

    // removes data subscription
    unsubscribe: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "unsubscribe", []);
    },

    // calls the success callback when new data is available with an ArrayBuffer
    subscribeRawData: function (success, failure) {

        successWrapper = function(data) {
            // Windows Phone flattens an array of one into a number which
            // breaks the API. Stuff it back into an ArrayBuffer.
            if (typeof data === 'number') {
                var a = new Uint8Array(1);
                a[0] = data;
                data = a.buffer;
            }
            success(data);
        };
        cordova.exec(successWrapper, failure, "BluetoothSerialUniversal", "subscribeRaw", []);
    },

    // removes data subscription
    unsubscribeRawData: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "unsubscribeRaw", []);
    },

    // clears the data buffer
    clear: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "clear", []);
    },

    // reads the RSSI of the *connected* peripherial
    readRSSI: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "readRSSI", []);
    },

    showBluetoothSettings: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "showBluetoothSettings", []);
    },

    enable: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "enable", []);
    },

    discoverUnpaired: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "discoverUnpaired", []);
    },

    setDeviceDiscoveredListener: function (notify) {
        if (typeof notify != 'function')
            throw 'BluetoothSerialUniversal.setDeviceDiscoveredListener: Callback not a function';

        cordova.exec(notify, null, "BluetoothSerialUniversal", "setDeviceDiscoveredListener", []);
    },

    clearDeviceDiscoveredListener: function () {
        cordova.exec(null, null, "BluetoothSerialUniversal", "clearDeviceDiscoveredListener", []);
    },

    setName: function (newName) {
        cordova.exec(null, null, "BluetoothSerialUniversal", "setName", [newName]);
    },

    setDiscoverable: function (discoverableDuration) {
        cordova.exec(null, null, "BluetoothSerialUniversal", "setDiscoverable", [discoverableDuration]);
    },

    startServer: function (success, failure) {
        cordova.exec(success, failure, "BluetoothSerialUniversal", "startServer", []);
    }


};

var stringToArrayBuffer = function(str) {
    var ret = new Uint8Array(str.length);
    for (var i = 0; i < str.length; i++) {
        ret[i] = str.charCodeAt(i);
    }
    return ret.buffer;
};
