import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  NgZone } from '@angular/core';

import * as BT from '../../app/bluetoothConstants';
declare var cordova: any;


/**
 * Generated class for the EnviarConfirmacao page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-enviar-confirmacao',
  templateUrl: 'enviar-confirmacao.html',
})
export class EnviarConfirmacao {
  isSending:boolean;
  isOk:boolean;
  mobileAddress:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone) {
    this.isSending = true;
    this.isOk = false;
    this.mobileAddress = navParams.get('deviceAddress');
    console.log('Enviara para o dispositivo: '+ this.mobileAddress);

    console.log( JSON.stringify(navParams) );
  }

  doSubscribe() {
    console.log('doSubscribe');
    cordova.plugins.usp.blueToothUniversal.subscribe( data=> {
          this.zone.run( ()=>{
            console.log( JSON.stringify(data));
            console.log( "leu algo no subscribe" );
            this.confirmaAcaoSubscriber( data );
          });
    },
    error=>{
        console.log( "erro" + JSON.stringify(error) );
        this.confirmaErroSubscriber( error );
    } );

  }

  confirmaAcaoSubscriber( data ) {

    console.log( "acao: " + data[ BT.ACTION ] + " / resultado: " + data[ BT.RESULT ] );
    if ( data[ BT.ACTION ] ) { // eh um json no padrao
        if ( data[ BT.ACTION ] == BT.CONNECT ) { // CONECT
           if ( data[ BT.RESULT ] == BT.BLUETOOTH_OK ) {
             this.enviaNUSP();
           }
        } else if ( data[ BT.ACTION ] == BT.READ ) {
           if ( data[ BT.RESULT ] == BT.BLUETOOTH_OK ) {
             this.recebeSeminarioConfirmado( data );
           }
        }
    }
  }

  recebeSeminarioConfirmado( data ) {
    console.log("Recebendo confirmação NUSP" );
    if ( data[ BT.MESSAGE ] && data[BT.MESSAGE] == 'OK' ) {
       console.log("Recebeu ok" );
       this.isOk = true;
       this.isSending = false;
    }
    this.stopServer();
  }

  confirmaErroSubscriber( data ) {
      if ( data[ BT.ACTION] ) { // eh um json no padrao
        if ( data[ BT.ACTION ] != BT.CONNECT && data[ BT.ACTION ] != BT.DISCONNECT ) {
          this.stopServer();
        }
      }
  }

  enviaNUSP() {
    console.log("Enviando NUSP" );
    cordova.plugins.usp.blueToothUniversal.write(this.mobileAddress, '{"'+BT.VALIDA_NUSP+'":"' + '123456789' + '"}', ( results ) =>
    {
        console.log("Enviou");
        console.log(results);
    }, 
    (error) => {

        console.log("Deu erro ao enviar NUSP");
        console.log(error);
        this.stopServer();
    });
  }

  connect() {
    console.log('connect');
    cordova.plugins.usp.blueToothUniversal.connect(this.mobileAddress, (status)=>{
           this.zone.run( ()=>{

              console.log( "Conectado!" + JSON.stringify(status) );
           });
      },
      error=>{
        this.zone.run( ()=>{
            console.log( "erro?" + JSON.stringify(error) );
            this.stopServer();

          } ); 
        });
  }

  stopServer() {
      this.isSending = false;
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

  ionViewDidLoad() {
    console.log('ionViewDidLoad EnviarConfirmacao');
    this.doSubscribe();
    this.connect();
  }

}
