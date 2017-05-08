package br.usp.computacaomovel.cordova;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.UUID;
import java.util.ArrayList;
import java.util.Arrays;

import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.os.ParcelUuid;


import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.json.JSONObject;
import org.json.JSONException;

import java.util.HashSet;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Collections;
import java.util.HashMap;

import br.usp.computacaomovel.cordova.IBluetoothMessageHandler;

/**
 * This class does all the work for setting up and managing Bluetoothi
 * connections with other devices. It has a thread that listens for
 * incoming connections, a thread for connecting with a device, and a
 * thread for performing data transmissions when connected.
 *
 * This code was based on the Android SDK BluetoothChat Sample
 * $ANDROID_SDK/samples/android-17/BluetoothChat
 */
public class BluetoothSerialServiceUniversal {

    // Debugging
    private static final String TAG = "BluetoothSerialService";
    private static final boolean D = true;

    // Name for the SDP record when creating server socket
    private static final String NAME_SECURE = "SeminarBluetoothSerialServiceSecure";
    private static final String NAME_INSECURE = "SeminarBluetoothSerialServiceInSecure";

    // Unique UUID for this application
    //private static final UUID MY_UUID_SECURE = UUID.fromString("7A9C3B55-78D0-44A7-A94E-A93E3FE118CE");
    private static final UUID MY_UUID_SECURE = UUID.fromString("2B479192-2D4B-11E7-9598-0800200C9A66");
    //private static final UUID MY_UUID_INSECURE = UUID.fromString("23F18142-B389-4772-93BD-52BDBB2C03E9");
    private static final UUID MY_UUID_INSECURE = UUID.fromString("2A1B9192-2D4C-11E7-9598-0800200C9A66");

    private static final int BLUETOOTH_CONNECT = 1;
    private static final int BLUETOOTH_READ = 2; 
    private static final int BLUETOOTH_LISTEN = 3;
    private static final int BLUETOOTH_DISCONNECT = 4;

    private static final int BLUETOOTH_FAIL = 0;
    private static final int BLUETOOTH_OK = 1;
    private static final int BLUETOOTH_SOCKET_CLOSED_BY_YOURSELF = 2;
    private static final int BLUETOOTH_SOCKET_CLOSED_BY_SOMEONE = 3;
    private static final int BLUETOOTH_NOT_CONNECTED_ERROR = -1;

    // Well known SPP UUID
    //private static final UUID UUID_SPP = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

    //private static final UUID UUID_SPP = UUID.fromString("00001112-0000-1000-8000-00805f9b34fb");
    //private static final UUID UUID_SPP =  MY_UUID_SECURE;

    // Member fields
    private final BluetoothAdapter mAdapter;
    private AcceptThread mSecureAcceptThread;
    private AcceptThread mInsecureAcceptThread;
    private ConnectThread mConnectThread;

    private Map<String,ConnectedThread> connectedSockets = new Hashtable<String, ConnectedThread>();

    private IBluetoothMessageHandler contextSubscriber;

    /**
     * Constructor. Prepares a new BluetoothSerial session.
     * @param handler  A Handler to send messages back to the UI Activity
     */
    public BluetoothSerialServiceUniversal() {
        mAdapter = BluetoothAdapter.getDefaultAdapter();
    }

    public void setSubscriber( IBluetoothMessageHandler contextSubscriber ) {
        this.contextSubscriber = contextSubscriber;
    }

    public IBluetoothMessageHandler getSubscriber() {
        return this.contextSubscriber;
    }

    public void releaseSubscriber() {
        this.contextSubscriber = null;
    }

    /**
     * Start the chat service. Specifically start AcceptThread to begin a
     * session in listening (server) mode. Called by the Activity onResume() */
    public synchronized void start( IBluetoothMessageHandler context ) {
        if (D) Log.d(TAG, "start server bluetooth");

        stop();

        // Start the thread to listen on a BluetoothServerSocket
        if (mSecureAcceptThread == null) {
            mSecureAcceptThread = new AcceptThread(true, contextSubscriber );
            mSecureAcceptThread.start();
        }

        context.sendSuccess( BLUETOOTH_OK, "Listenning ok!" );
        /*
        if (mInsecureAcceptThread == null) {
            mInsecureAcceptThread = new AcceptThread(false, context);
            mInsecureAcceptThread.start();
        }*/
    }

    /**
     * Start the ConnectThread to initiate a connection to a remote device.
     * @param device  The BluetoothDevice to connect
     * @param secure Socket Security type - Secure (true) , Insecure (false)
     */
    public synchronized void connect(BluetoothDevice device, boolean secure, IBluetoothMessageHandler context ) {
        if (D) Log.d(TAG, "connect to: " + device);
        
        // Start the thread to connect with the given device
        mConnectThread = new ConnectThread(device, secure, context);
        mConnectThread.start();
    }

    /**
     * Start the ConnectedThread to begin managing a Bluetooth connection
     * @param socket  The BluetoothSocket on which the connection was made
     * @param device  The BluetoothDevice that has been connected
     */
    public synchronized void connected(BluetoothSocket socket, BluetoothDevice device, final String socketType, IBluetoothMessageHandler context) {
        if (D) Log.d(TAG, "connected, Socket Type:" + socketType);

        String deviceAddress = device.getAddress();


        context.notifyOk( BLUETOOTH_OK, BLUETOOTH_CONNECT, deviceAddress, "Connected!"  );

        ConnectedThread rct = new ConnectedThread( socket, context );
        connectedSockets.put( deviceAddress, rct );
        rct.start();
        
    }

    /**
     * Stop all threads
     */
    public synchronized void stop() {
        if (D) Log.d(TAG, "stop");

        if (mSecureAcceptThread != null) {
            mSecureAcceptThread.cancel();
            mSecureAcceptThread = null;
        }

        if (mInsecureAcceptThread != null) {
            mInsecureAcceptThread.cancel();
            mInsecureAcceptThread = null;
        }

        for ( ConnectedThread i:connectedSockets.values() ) {
            i.cancel();
        }
        connectedSockets.clear();


        if (mConnectThread != null) {
            mConnectThread.cancel();
            mConnectThread = null;
        }

    }

    public boolean isConnected( String deviceAddress ) {
        ConnectedThread c = connectedSockets.get( deviceAddress );
        return c != null;
    }

    public List<BluetoothDevice> listConnected() {
       List<BluetoothDevice> l = new ArrayList<BluetoothDevice>();
       for ( ConnectedThread i:(connectedSockets.values()) ) {
           l.add( i.getDevice() );
       }
       return l;
    }

    public synchronized void stop( String deviceAddress ) {
        if (D) Log.d(TAG, "stop: " + deviceAddress );

        ConnectedThread c = connectedSockets.get( deviceAddress );
        if ( c== null ) {
             contextSubscriber.notifyError( BLUETOOTH_NOT_CONNECTED_ERROR, BLUETOOTH_DISCONNECT, deviceAddress, "not connected!" );
        } else {
            c.cancel();
            connectedSockets.remove( deviceAddress );
        }
    }

    /**
     * Write to the ConnectedThread in an unsynchronized manner
     * @param out The bytes to write
     * @see ConnectedThread#write(byte[])
     */
    public void write( String deviceAddress, byte[] buffer, IBluetoothMessageHandler context ) {
        ConnectedThread c = connectedSockets.get( deviceAddress );
        c.write( buffer, context);
    }

    /**
     * This thread runs while listening for incoming connections. It behaves
     * like a server-side client. It runs until a connection is accepted
     * (or until cancelled).
     */
    private class AcceptThread extends Thread {
        // The local server socket
        private final BluetoothServerSocket mmServerSocket;
        private String mSocketType;
        private IBluetoothMessageHandler context;
        private boolean stopIt;

        public AcceptThread(boolean secure, IBluetoothMessageHandler context ) {
            BluetoothServerSocket tmp = null;
            stopIt = false;
            mSocketType = secure ? "Secure":"Insecure";
            this.context = context;
            // Create a new listening server socket
            try {
                if (secure) {
                    tmp = mAdapter.listenUsingRfcommWithServiceRecord(NAME_SECURE, MY_UUID_SECURE);
                } else {
                    tmp = mAdapter.listenUsingInsecureRfcommWithServiceRecord(NAME_INSECURE, MY_UUID_INSECURE);
                }
            } catch (IOException e) {
                Log.e(TAG, "Socket Type: " + mSocketType + "listen() failed", e);
                context.notifyError( BLUETOOTH_SOCKET_CLOSED_BY_SOMEONE, BLUETOOTH_LISTEN,  "Impossible to listen, any error." );
            }
            mmServerSocket = tmp;
        }

        public void run() {
            if (D) Log.d(TAG, "Socket Type: " + mSocketType + "BEGIN mAcceptThread" + this);
            setName("AcceptThread" + mSocketType);

            BluetoothSocket socket = null;

            // Listen to the server socket if we're not connected
            while ( !stopIt && mmServerSocket != null ) {
                try {
                    // This is a blocking call and will only return on a
                    // successful connection or an exception

                    Log.d(TAG, ">>>>> waiting for a new connection");
                    socket = mmServerSocket.accept();
                    Log.d(TAG, ">>>>> connected!!!");
                } catch (IOException e) {
                    if ( stopIt ) {
                        Log.d(TAG, "Socket Closed", e);
                        context.notifyOk( BLUETOOTH_SOCKET_CLOSED_BY_YOURSELF, BLUETOOTH_LISTEN,  "Stopped to listen, as wished." );
                    } else {
                        Log.e(TAG, "Socket Type: " + mSocketType + "accept() failed", e);
                        context.notifyError( BLUETOOTH_SOCKET_CLOSED_BY_SOMEONE, BLUETOOTH_LISTEN,  "Stopped to listen, any error." );
                        cancel();
                    }
                }

                // If a connection was accepted
                if (socket != null) {
                
                    synchronized (BluetoothSerialServiceUniversal.this) {

                            connected(socket, socket.getRemoteDevice(),
                                        mSocketType, context );

                    }
                    socket = null;
                }
            }  
            if (D) Log.i(TAG, "END mAcceptThread, socket Type: " + mSocketType);

        }

        public void cancel() {
            if (D) Log.d(TAG, "Socket Type" + mSocketType + "cancel " + this);
            stopIt = true;
            try {
                mmServerSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "Socket Type" + mSocketType + "close() of server failed", e);
            }
        }
    }


    /**
     * This thread runs while attempting to make an outgoing connection
     * with a device. It runs straight through; the connection either
     * succeeds or fails.
     */
    private class ConnectThread extends Thread {
        private /*final*/ BluetoothSocket mmSocket = null;
        private final BluetoothDevice mmDevice;
        private String mSocketType;
        private IBluetoothMessageHandler context;

        public ConnectThread(BluetoothDevice device, boolean secure, IBluetoothMessageHandler context) {
            mmDevice = device;
            BluetoothSocket tmp = null;
            mSocketType = secure ? "Secure" : "Insecure";
            this.context = context;

            // Get a BluetoothSocket for a connection with the given BluetoothDevice
            try {
                if (secure) {
                    tmp = device.createRfcommSocketToServiceRecord(MY_UUID_SECURE);
                } else {
                    tmp = device.createInsecureRfcommSocketToServiceRecord(MY_UUID_INSECURE);
                }
            } catch (IOException e) {
                Log.e(TAG, "Socket Type: " + mSocketType + "create() failed", e);
            }
            mmSocket = tmp;
        }

        public void run() {
            Log.i(TAG, "BEGIN mConnectThread SocketType:" + mSocketType);
            setName("ConnectThread" + mSocketType);

            // Always cancel discovery because it will slow down a connection
            mAdapter.cancelDiscovery();

            if ( mmSocket == null ) {
                context.sendError( BLUETOOTH_FAIL, "Fail to connect! Impossible to create the socket "  );
                return;
            }

            // Make a connection to the BluetoothSocket
            try {
                // This is a blocking call and will only return on a successful connection or an exception
                Log.i(TAG,"Connecting to socket...");
                mmSocket.connect();
                Log.i(TAG,"Connected");
            } catch (IOException e) {
                Log.e(TAG, e.toString());

                // Some 4.1 devices have problems, try an alternative way to connect
                // See https://github.com/don/BluetoothSerial/issues/89
                try {
                    Log.i(TAG,"Trying fallback...");
                    mmSocket = (BluetoothSocket) mmDevice.getClass().getMethod("createRfcommSocket", new Class[] {int.class}).invoke(mmDevice,1);
                    mmSocket.connect();
                    Log.i(TAG,"Connected");
                } catch (Exception e2) {
                    Log.e(TAG, "Couldn't establish a Bluetooth connection.");
                    try {
                        mmSocket.close();
                    } catch (IOException e3) {
                        Log.e(TAG, "unable to close() " + mSocketType + " socket during connection failure", e3);
                    }
                    context.sendError( BLUETOOTH_FAIL, "Fail to connect: " + e2.getMessage() );
                    return;
                }
            }

            // Reset the ConnectThread because we're done
            synchronized (BluetoothSerialServiceUniversal.this) {
                mConnectThread = null;
            }

            // Start the connected thread
            connected(mmSocket, mmDevice, mSocketType, contextSubscriber );

            Log.d(TAG, "ok connection");
            context.sendSuccess( BLUETOOTH_OK, "ok connection!" );
        }

        public void cancel() {
            try {
                mmSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "close() of connect " + mSocketType + " socket failed", e);
            }
        }
    }


        /**
     * This thread runs during a connection with a remote device.
     * It handles all incoming and outgoing transmissions.
     */
    private class WriteConnectedThread extends Thread {
        private final BluetoothSocket mmSocket;
        private final byte[] buffer;
        private IBluetoothMessageHandler context;

        public WriteConnectedThread(BluetoothSocket socket, byte[] buffer, IBluetoothMessageHandler context ) {
            Log.d(TAG, "create WriteConnectedThread " );
            mmSocket = socket;
            this.buffer = buffer;
            this.context = context;
        }

        /**
         * Write to the connected OutStream.
         * @param buffer  The bytes to write
         */
        public void run() {
            try {
                OutputStream mmOutStream = mmSocket.getOutputStream();

                mmOutStream.write(buffer);

                Log.d(TAG, "ok during written");
                context.sendSuccess( BLUETOOTH_OK, "Wroted successfuly!"  );

            } catch (IOException e) {
                Log.e(TAG, "Exception during write", e);
                context.sendError( BLUETOOTH_FAIL,"Excdedption during write: " +e.getMessage() );
            }
        }
    }


        /**
     * This thread runs during a connection with a remote device.
     * It handles all incoming and outgoing transmissions.
     */
    private class ConnectedThread extends Thread {
        private final BluetoothSocket mmSocket;
        private IBluetoothMessageHandler context;
        private boolean stopIt;
        private String deviceAddress;
        private BluetoothDevice device; 

        public ConnectedThread(BluetoothSocket socket, IBluetoothMessageHandler context  ) {
            Log.d(TAG, "create ReadConnectedThread " );
            mmSocket = socket;
            this.context = context;
            this.stopIt = false;
            this.device = socket.getRemoteDevice();
            this.deviceAddress = device.getAddress();
        }

        /**
         * Write to the connected OutStream.
         * @param buffer  The bytes to write
         */
        public void run() {
            InputStream mmInStream = null;
            byte[] buffer = new byte[1024];
            int bytes;
            try {
                mmInStream = mmSocket.getInputStream();
            } catch (IOException e) {
                Log.e(TAG, "Exception during input stream", e);
                context.notifyError( BLUETOOTH_FAIL,e.getMessage() );
            }
            if ( mmInStream!=null ) {

                while (true) {
                    try {
                        // Read from the InputStream
                        Log.d( TAG, "waiting for data" );
                        bytes = mmInStream.read(buffer);

                        Log.d( TAG, ">>>>> Data readed!" );

                        context.notifyOk( BLUETOOTH_OK, BLUETOOTH_READ, deviceAddress, new String( buffer, 0, bytes ) );

                    } catch (IOException e) {
                        Log.d(TAG, "disconnected", e);

                        if ( stopIt ) {
                            Log.d(TAG, "Stopped as wished" + deviceAddress, e);

                            context.notifyOk( BLUETOOTH_SOCKET_CLOSED_BY_YOURSELF, BLUETOOTH_READ, deviceAddress,"Stopped to read, as wished." );

                        } else {
                            Log.e(TAG, "Stop to read.", e);
                            if ( !mmSocket.isConnected() ) {
                                connectedSockets.remove( deviceAddress );

                                context.notifyOk( BLUETOOTH_SOCKET_CLOSED_BY_SOMEONE, BLUETOOTH_READ, deviceAddress, "Socket was closed by someone" );


                            } else {
                                connectedSockets.remove( deviceAddress );
                                cancel();
                                context.notifyError( BLUETOOTH_FAIL, BLUETOOTH_READ, deviceAddress, "Error reading!" );

                            }

                        }
                        break;
                    }
                }
            
                
            }

            

        }
        private void stopIt() {
            this.stopIt = true;
        }

        public void cancel() {
            stopIt();
            try {
                mmSocket.close();
            } catch (IOException e) {
                Log.e(TAG, "close() of connect socket failed", e);
            }
        }

        public void write( byte[] buffer, IBluetoothMessageHandler context ) {
            new WriteConnectedThread(mmSocket, buffer, context).start();
        }

        public BluetoothDevice getDevice() {
            return device;
        }
    }

    // public synchronized void stopRead( CallbackContext context ) {
    //     try {
    //         if ( readConnectThread != null ) {
    //             readConnectThread.stopIt();
    //             readConnectThread = null;
    //         }
    //         Log.d(TAG, "Stop to read method.");
    //         context.success( createJSONMessage( 1, "Stop to read method! Socket closed???" + mmConnectedSocket.isConnected() ) );
    //     } catch ( Exception e ) {
    //         Log.e(TAG, "Exception during stop to read!", e);
    //         context.error( createJSONMessage( 0, "Exception during stop to read!" ) );
    //     }
    // }

    /**
     * Read to the ConnectedThread in an unsynchronized manner
     */
    // public synchronized void startRead( CallbackContext context ) {
    //     if ( readConnectThread != null ) {
    //         readConnectThread.stopIt();
    //     }
    //     readConnectThread = new ReadConnectedThread(mmConnectedSocket, context);
    //     readConnectThread.start();
    // }

}
