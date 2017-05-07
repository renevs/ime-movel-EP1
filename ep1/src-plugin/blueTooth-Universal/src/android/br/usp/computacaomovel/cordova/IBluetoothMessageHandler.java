package br.usp.computacaomovel.cordova;

public interface IBluetoothMessageHandler {
    public void notifyOk( int code, int action, String deviceAddress, Object message );
    public void notifyError( int code, int action, String deviceAddress, Object message );

    public void notifyOk( int code, int action, Object message );
    public void notifyError( int code, int action, Object message );
    public void notifyOk( int code, Object message );
    public void notifyError( int code, Object message );

    public void sendSuccess( int code, Object message );

    public void sendError( int code, Object message );

}