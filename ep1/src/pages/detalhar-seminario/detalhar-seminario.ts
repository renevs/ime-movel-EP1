import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  NgZone } from '@angular/core';
import * as BT from '../../app/bluetoothConstants';
import {Platform} from 'ionic-angular';

declare var cordova: any;


/**
 * Generated class for the DetalharSeminario page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-detalhar-seminario',
  templateUrl: 'detalhar-seminario.html',
})
export class DetalharSeminario {
  isListening:boolean;
  idSeminario:number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private zone:NgZone,
    public platform:Platform ) {
    this.isListening = false;

    // this.idSeminario = navParams.get('idSeminario');
    this.idSeminario = 10;
    console.log('Seminario: '+ this.idSeminario );


    cordova.plugins.usp.blueToothUniversal.subscribe( data=> {
            console.log( JSON.stringify(data));
            console.log( "leu algo no subscribe" );
            this.confirmaAcaoSubscriber( data );
            },
            error=>{
                this.zone.run( ()=>{
                    console.log( "erro" + JSON.stringify(error) );
                    if ( error[ BT.ACTION ]) {
                        if ( error[ BT.ACTION ] == BT.LISTEN ) {
                            alert( "Escuta interrompida!" );
                            this.stopServer();
                        }
                    }
                } );
            } );
  }

  qrCodeSize() {
      return this.platform.width() / 10; // (100/6)% do tamanho da tela
  }

  confirmaAcaoSubscriber( data ) {
      if ( data[ BT.ACTION ] ) { // eh um json no padrao
        if ( data[ BT.ACTION ] == BT.READ ) {
           if ( data[ BT.RESULT ] == BT.BLUETOOTH_OK ) {
             this.confirmaNUSP( data );
           }
        }
      }
  }

  confirmaNUSP( data ) {
    if ( data[ BT.MESSAGE ] ) {
        var jsonUSP = null;
        try{ 
            jsonUSP = JSON.parse( data[ BT.MESSAGE ] );
            
            
        } catch(e) {
            console.log( "Erro: " + e );
        }
        if ( jsonUSP != null ) {
            //TODO: chamar serviço para validar
            console.log( JSON.stringify( jsonUSP ) );
            console.log( "Chamando serviço: " + jsonUSP[ BT.VALIDA_NUSP] ); 

            //if erro... desconecta!!!!

            this.enviaOK( data[ BT.DEVICE ] );
        } else {
            console.log( "Erro ao receber numero usp" ); 
            this.disconnect( data[ BT.DEVICE ] );
        }
    }
  }

  enviaOK( deviceAddress ) {
    cordova.plugins.usp.blueToothUniversal.write(deviceAddress, BT.OK_MESSAGE, ( results ) =>
    {
        console.log("Enviou OK");
        console.log(results);
        this.disconnect( deviceAddress );
    }, 
    (error) => {

        console.log("Deu erro ao enviar OK");
        console.log(error);
        this.disconnect( deviceAddress );
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetalharSeminario');
  }

  startServer() {
        cordova.plugins.usp.blueToothUniversal.startServer( (status)=>{
                console.log("startou o server");

                this.isListening = true;
                this.zone.run( ()=>{
                    console.log("server startado ok");
                });
            },
            error=>{
                this.zone.run( ()=>{
                    console.log("server error");
                    console.log( JSON.stringify(error) );
                }
                );
            });
  }

  listenData( event ) {
      cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) =>
                {
                    console.log(results);
                    this.startServer();
                }, 
                (error) => {
                    console.log(error);
                    alert( "Bluetooth está desligado. Ligue e tente novamente!");
                }
      )
    
  }

  disconnect( deviceAddress ) {
      this.isListening = false;
      cordova.plugins.usp.blueToothUniversal.disconnect( deviceAddress, (status)=>{
                console.log("Desconectou: "+ deviceAddress);
            },
            error=>{
                console.log("Erro ao desconectar");
            }
      );
  }

  stopServer() {
      this.isListening = false;
      cordova.plugins.usp.blueToothUniversal.disconnectAll( (status)=>{
            console.log("Desconectou");
                this.zone.run( ()=>{
                console.log("PArou de escutar com sucesso");
                    
                });
            },
            error=>{
                this.zone.run( ()=>{
                    console.log("Erro ao parar de escutar");
                });
            }
      );
  }
  stopListenData( event ) {
      this.stopServer();
  }
  projectQRCode( event ) {
      this.navCtrl.push( "QrcodeSeminario", { idSeminario:this.idSeminario } );
  }
}
