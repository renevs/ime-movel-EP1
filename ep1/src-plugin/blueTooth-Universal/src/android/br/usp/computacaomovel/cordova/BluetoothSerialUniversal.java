package br.usp.computacaomovel.cordova;

import android.Manifest;
import android.content.pm.PackageManager;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Handler;
import android.os.Message;
import android.provider.Settings;
import android.util.Log;
import br.usp.computacaomovel.cordova.BluetoothSerialServiceUniversal;
import br.usp.computacaomovel.cordova.IBluetoothMessageHandler;

import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.LOG;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Set;
import java.util.List;

public class BluetoothSerialUniversal extends CordovaPlugin {

    // actions
    private static final String LIST = "list";
    private static final String CONNECT = "connect";
    private static final String CONNECT_INSECURE = "connectInsecure";
    private static final String DISCONNECT = "disconnect";
    private static final String DISCONNECT_ALL = "disconnectAll";
    private static final String WRITE = "write";
    private static final String AVAILABLE = "available";
    private static final String READ = "read";
    private static final String READ_UNTIL = "readUntil";
    private static final String SUBSCRIBE = "subscribe";
    private static final String UNSUBSCRIBE = "unsubscribe";
    private static final String SUBSCRIBE_RAW = "subscribeRaw";
    private static final String UNSUBSCRIBE_RAW = "unsubscribeRaw";
    private static final String IS_ENABLED = "isEnabled";
    private static final String IS_CONNECTED = "isConnected";
    private static final String CLEAR = "clear";
    private static final String SETTINGS = "showBluetoothSettings";
    private static final String ENABLE = "enable";
    private static final String DISCOVER_UNPAIRED = "discoverUnpaired";
    private static final String SET_DEVICE_DISCOVERED_LISTENER = "setDeviceDiscoveredListener";
    private static final String CLEAR_DEVICE_DISCOVERED_LISTENER = "clearDeviceDiscoveredListener";
    private static final String SET_NAME = "setName";
    private static final String SET_DISCOVERABLE = "setDiscoverable";

    // Rene:
    private static final String START_SERVER = "startServer";
    private static final String LIST_CONNECTED = "listConnected";

    // Debugging
    private static final String TAG = "BluetoothSerialUniversal";
    private static final boolean D = true;

    StringBuffer buffer = new StringBuffer();


    private static final int REQUEST_ENABLE_BLUETOOTH = 1;
    // Android 23 requires user to explicitly grant permission for location to discover unpaired
    private static final String ACCESS_COARSE_LOCATION = Manifest.permission.ACCESS_COARSE_LOCATION;
    private static final int CHECK_PERMISSIONS_REQ_CODE = 2;

    private CallbackContext permissionCallback;
    private CallbackContext enableBluetoothCallback;
    private CallbackContext deviceDiscoveredCallback;

    private BluetoothAdapter bluetoothAdapter;
    private BluetoothSerialServiceUniversal bluetoothSerialService;


    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {

        LOG.d(TAG, "action = " + action);
        
        if (bluetoothAdapter == null) {
            bluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        }

        if (bluetoothSerialService == null) {
            bluetoothSerialService = new BluetoothSerialServiceUniversal();
            LOG.i(TAG, ">>>>> iniciou o bluetoothService");
             
            

        }

        boolean validAction = true;

        if (action.equals(LIST)) {

            listBondedDevices(callbackContext);
	    } else if (action.equals(START_SERVER)) {
            startServer(callbackContext);

        } else if (action.equals(CONNECT)) {

            boolean secure = true;
            connect(args, true, callbackContext);

        } else if (action.equals(CONNECT_INSECURE)) {

            boolean secure = false;
            connect(args, secure, callbackContext);
        } else if (action.equals(DISCONNECT_ALL)) {
            bluetoothSerialService.stop();
            callbackContext.success();
        } else if (action.equals(DISCONNECT)) {
            String macAddress = args.getString(0);
            bluetoothSerialService.stop( macAddress );
            callbackContext.success();

        } else if (action.equals(WRITE)) {
            String macAddress = args.getString(0);
            byte[] data = args.getArrayBuffer(1);

            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);

            bluetoothSerialService.write( macAddress, data, new CordovaBluetoohMessageHandler( callbackContext ));

        } else if (action.equals(AVAILABLE)) {

            //TODO: callbackContext.success(available());

        } else if (action.equals(READ)) {

            //TODO: callbackContext.success(read());

        } else if (action.equals(READ_UNTIL)) {

            String interesting = args.getString(0);
            //TODO: callbackContext.success(readUntil(interesting));

        } else if (action.equals(SUBSCRIBE)) {
            bluetoothSerialService.setSubscriber( new CordovaBluetoohMessageHandler( callbackContext ) );
            // bluetoothSerialService.startRead( callbackContext );

            //delimiter = args.getString(0);
            //dataAvailableCallback = callbackContext;

            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);

        } else if (action.equals(UNSUBSCRIBE)) {
            CordovaBluetoohMessageHandler subscriberHandler = (CordovaBluetoohMessageHandler) bluetoothSerialService.getSubscriber(); 
            bluetoothSerialService.releaseSubscriber();
            subscriberHandler.releaseSubscriber();
            // bluetoothSerialService.stopRead( callbackContext );
            //delimiter = null;

            // send no result, so Cordova won't hold onto the data available callback anymore
            //PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            //dataAvailableCallback.sendPluginResult(result);
            //dataAvailableCallback = null;

            //callbackContext.success();

        } else if (action.equals(SUBSCRIBE_RAW)) {
            bluetoothSerialService.setSubscriber( new CordovaBluetoohMessageHandler( callbackContext ) );
            // bluetoothSerialService.startRead( callbackContext );

            //rawDataAvailableCallback = callbackContext;

            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);

        } else if (action.equals(UNSUBSCRIBE_RAW)) {
            // bluetoothSerialService.stopRead( callbackContext );

            //rawDataAvailableCallback = null;

            //callbackContext.success();

        } else if (action.equals(IS_ENABLED)) {

            if (bluetoothAdapter.isEnabled()) {
                callbackContext.success();
            } else {
                callbackContext.error("Bluetooth is disabled.");
            }

        } else if (action.equals(IS_CONNECTED)) {
            
            String macAddress = args.getString(0);
            if (bluetoothSerialService.isConnected( macAddress ) ) {
                callbackContext.success();
            } else {
                callbackContext.error("Not connected.");
            }
        } else if (action.equals(LIST_CONNECTED)) {
            listConnectedDevices( callbackContext );

        } else if (action.equals(CLEAR)) {

            buffer.setLength(0);
            callbackContext.success();

        } else if (action.equals(SETTINGS)) {

            Intent intent = new Intent(Settings.ACTION_BLUETOOTH_SETTINGS);
            cordova.getActivity().startActivity(intent);
            callbackContext.success();

        } else if (action.equals(ENABLE)) {

            enableBluetoothCallback = callbackContext;
            Intent intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            cordova.startActivityForResult(this, intent, REQUEST_ENABLE_BLUETOOTH);

        } else if (action.equals(DISCOVER_UNPAIRED)) {

            if (cordova.hasPermission(ACCESS_COARSE_LOCATION)) {
                discoverUnpairedDevices(callbackContext);
            } else {
                permissionCallback = callbackContext;
                cordova.requestPermission(this, CHECK_PERMISSIONS_REQ_CODE, ACCESS_COARSE_LOCATION);
            }

        } else if (action.equals(SET_DEVICE_DISCOVERED_LISTENER)) {

            this.deviceDiscoveredCallback = callbackContext;

        } else if (action.equals(CLEAR_DEVICE_DISCOVERED_LISTENER)) {

            this.deviceDiscoveredCallback = null;

        } else if (action.equals(SET_NAME)) {

            String newName = args.getString(0);
            bluetoothAdapter.setName(newName);
            callbackContext.success();

        } else if (action.equals(SET_DISCOVERABLE)) {

            int discoverableDuration = args.getInt(0);
            Intent discoverIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
            discoverIntent.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, discoverableDuration);
            cordova.getActivity().startActivity(discoverIntent);

        } else {
            validAction = false;

        }

        return validAction;
    }





    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == REQUEST_ENABLE_BLUETOOTH) {

            if (resultCode == Activity.RESULT_OK) {
                Log.d(TAG, "User enabled Bluetooth");
                if (enableBluetoothCallback != null) {
                    enableBluetoothCallback.success();
                }
            } else {
                Log.d(TAG, "User did *NOT* enable Bluetooth");
                if (enableBluetoothCallback != null) {
                    enableBluetoothCallback.error("User did not enable Bluetooth");
                }
            }

            enableBluetoothCallback = null;
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (bluetoothSerialService != null) {
            bluetoothSerialService.stop();
        }
    }


    private void listConnectedDevices(CallbackContext callbackContext) throws JSONException {
        JSONArray deviceList = new JSONArray();
        List<BluetoothDevice> connectedDevices = bluetoothSerialService.listConnected();

        for (BluetoothDevice device : connectedDevices) {
            deviceList.put(deviceToJSON(device));
        }
        callbackContext.success(deviceList);
    }

    private void listBondedDevices(CallbackContext callbackContext) throws JSONException {
        JSONArray deviceList = new JSONArray();
        Set<BluetoothDevice> bondedDevices = bluetoothAdapter.getBondedDevices();

        for (BluetoothDevice device : bondedDevices) {
            deviceList.put(deviceToJSON(device));
        }
        callbackContext.success(deviceList);
    }

    private void discoverUnpairedDevices(final CallbackContext callbackContext) throws JSONException {

        final CallbackContext ddc = deviceDiscoveredCallback;

        final BroadcastReceiver discoverReceiver = new BroadcastReceiver() {

            private JSONArray unpairedDevices = new JSONArray();

            public void onReceive(Context context, Intent intent) {
                String action = intent.getAction();
                if (BluetoothDevice.ACTION_FOUND.equals(action)) {
                    BluetoothDevice device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);
                    try {
                    	JSONObject o = deviceToJSON(device);
                        unpairedDevices.put(o);
                        if (ddc != null) {
                            PluginResult res = new PluginResult(PluginResult.Status.OK, o);
                            res.setKeepCallback(true);
                            ddc.sendPluginResult(res);
                        }
                    } catch (JSONException e) {
                        // This shouldn't happen, log and ignore
                        Log.e(TAG, "Problem converting device to JSON", e);
                    }
                } else if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED.equals(action)) {
                    callbackContext.success(unpairedDevices);
                    cordova.getActivity().unregisterReceiver(this);
                }
            }
        };

        Activity activity = cordova.getActivity();
        activity.registerReceiver(discoverReceiver, new IntentFilter(BluetoothDevice.ACTION_FOUND));
        activity.registerReceiver(discoverReceiver, new IntentFilter(BluetoothAdapter.ACTION_DISCOVERY_FINISHED));
        bluetoothAdapter.startDiscovery();
    }

    private JSONObject deviceToJSON(BluetoothDevice device) throws JSONException {
        JSONObject json = new JSONObject();
        json.put("name", device.getName());
        json.put("address", device.getAddress());
        json.put("id", device.getAddress());
        if (device.getBluetoothClass() != null) {
            json.put("class", device.getBluetoothClass().getDeviceClass());
        }
        return json;
    }

    private void connect(CordovaArgs args, boolean secure, CallbackContext callbackContext) throws JSONException {
        String macAddress = args.getString(0);
        BluetoothDevice device = bluetoothAdapter.getRemoteDevice(macAddress);

        if (device != null) {
            bluetoothSerialService.connect(device, secure, new CordovaBluetoohMessageHandler( callbackContext ));

            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            result.setKeepCallback(true);
            callbackContext.sendPluginResult(result);

        } else {
            Log.e(TAG, "Device not found!");
            JSONObject r = new JSONObject();
            r.put("return", 0);
            r.put("message", "Device not found" );
            callbackContext.error(r);
        }
    }



    private void startServer(CallbackContext callbackContext) throws JSONException {
        bluetoothSerialService.start( new CordovaBluetoohMessageHandler( callbackContext ) );

        // PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
        // result.setKeepCallback(true);
        // callbackContext.sendPluginResult(result);
    }

    @Override
    public void onRequestPermissionResult(int requestCode, String[] permissions,
                                          int[] grantResults) throws JSONException {

        for(int result:grantResults) {
            if(result == PackageManager.PERMISSION_DENIED) {
                LOG.d(TAG, "User *rejected* location permission");
                this.permissionCallback.sendPluginResult(new PluginResult(
                        PluginResult.Status.ERROR,
                        "Location permission is required to discover unpaired devices.")
                    );
                return;
            }
        }

        switch(requestCode) {
            case CHECK_PERMISSIONS_REQ_CODE:
                LOG.d(TAG, "User granted location permission");
                discoverUnpairedDevices(permissionCallback);
                break;
        }
    }


    class CordovaBluetoohMessageHandler implements IBluetoothMessageHandler {
        private CallbackContext context;

        private JSONObject createJSONMessage( int code, Object message ) {
            try {
                JSONObject r = new JSONObject();
                r.put("return", code);
                r.put("message", message );
                return r;
            } catch ( JSONException e ) {
                Log.e(TAG, "Error creating json message!", e);
            }
            return null;
        }
        private JSONObject createJSONMessage( int code, int action, Object message ) {
            try {
                JSONObject r = new JSONObject();
                r.put("return", code);
                r.put("action", action );
                r.put("message", message );
                return r;
            } catch ( JSONException e ) {
                Log.e(TAG, "Error creating json message!", e);
            }
            return null;
        }

        private JSONObject createJSONMessage( int code, int action, String deviceAddress, Object message ) {
            try {
                JSONObject r = new JSONObject();
                r.put("return", code);
                r.put("message", message );
                r.put("action", action );
                r.put( "device", deviceAddress );
                return r;
            } catch ( JSONException e ) {
                Log.e(TAG, "Error creating json message!", e);
            }
            return null;
        }

        public CordovaBluetoohMessageHandler( CallbackContext callbackContext ) {
            this.context = callbackContext;
        }
        public void notifyOk( int code, int action, String deviceAddress, Object message ) {
            PluginResult result = new PluginResult( PluginResult.Status.OK, 
                             createJSONMessage( code, action, deviceAddress, message ) );
            result.setKeepCallback(true); 
            context.sendPluginResult(result);
        }
        public void notifyError( int code, int action, String deviceAddress, Object message ) {
            PluginResult result = new PluginResult( PluginResult.Status.ERROR, 
                             createJSONMessage( code, action, deviceAddress, message ) );
            result.setKeepCallback(true); 
            context.sendPluginResult(result);
        }

        public void notifyOk( int code, int action, Object message ) {
            PluginResult result = new PluginResult( PluginResult.Status.OK, 
                             createJSONMessage( code, action, message ) );
            result.setKeepCallback(true); 
            context.sendPluginResult(result);
        }
        public void notifyError( int code, int action, Object message ) {
            PluginResult result = new PluginResult( PluginResult.Status.ERROR,
                             createJSONMessage( code, action, message ) );
            result.setKeepCallback(true);
            context.sendPluginResult(result);
       }
        public void notifyOk( int code, Object message ) {
            PluginResult result = new PluginResult( PluginResult.Status.OK, 
                             createJSONMessage( code, message ) );
            result.setKeepCallback(true); 
            context.sendPluginResult(result);
        }
        public void notifyError( int code, Object message ) {

           PluginResult result = new PluginResult( PluginResult.Status.ERROR, 
                             createJSONMessage( code, message ) );
            result.setKeepCallback(true); 
            context.sendPluginResult(result);
        }

        public void sendSuccess( int code, Object message ) {
            context.success( createJSONMessage( code, message ) );
        }

        public void sendError( int code, Object message ) {

            context.error( createJSONMessage( code, message ) );
        }

        public void releaseSubscriber() {
            PluginResult result = new PluginResult(PluginResult.Status.NO_RESULT);
            this.context.sendPluginResult(result);
        }

    }
    

}