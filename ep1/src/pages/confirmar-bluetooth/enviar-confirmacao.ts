import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import {  NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../../services/utils.service';


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
  nusp:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public zone: NgZone, private storage: Storage, 
    private utilsService: UtilsService, private menu: MenuController) {
    this.isSending = true;
    this.isOk = false;
    this.mobileAddress = navParams.get('deviceAddress');
    // console.log('Enviara para o dispositivo: '+ this.mobileAddress);

    // console.log( JSON.stringify(navParams) );
  }

  doSubscribe() {
    // console.log('doSubscribe');
    cordova.plugins.usp.blueToothUniversal.subscribe( data=> {
          this.zone.run( ()=>{
            // console.log( JSON.stringify(data));
            // console.log( "leu algo no subscribe" );
            this.confirmaAcaoSubscriber( data );
          });
    },
    error=>{
        // console.log( "erro" + JSON.stringify(error) );
        this.confirmaErroSubscriber( error );
    } );

  }

  confirmaAcaoSubscriber( data ) {

    // console.log( "acao: " + data[ BT.ACTION ] + " / resultado: " + data[ BT.RESULT ] );
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
    // console.log("Recebendo confirmação NUSP" );
    if ( data[ BT.MESSAGE ] && data[BT.MESSAGE] == 'OK' ) {
      //  console.log("Recebeu ok" );
       this.isOk = true;
      //  this.isSending = false;
    } else {
      this.isOk = false;
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
    // console.log("Enviando NUSP" );
    cordova.plugins.usp.blueToothUniversal.write(this.mobileAddress, '{"'+BT.VALIDA_NUSP+'":"' + this.nusp + '"}', ( results ) =>
    {
        // console.log("Enviou");
        // console.log(results);
    }, 
    (error) => {

        this.utilsService.presentToast("Falha ao enviar NUSP para o professor!");
        // console.log(error);
        this.stopServer();
    });
  }

  connect( ) {
    // console.log('connect');
    cordova.plugins.usp.blueToothUniversal.connect(this.mobileAddress, (status)=>{
           this.zone.run( ()=>{

              // console.log( "Conectado!" + JSON.stringify(status) );
           });
      },
      error=>{
        this.zone.run( ()=>{
            // console.log( "erro?" + JSON.stringify(error) );
            this.isOk = false;
            this.utilsService.presentToast( "Falha ao se conectar com o dispositivo do professor! Ele está escutando?");
            this.stopServer();

          } ); 
        });
  }

  stopServer() {
      this.isSending = false;
      cordova.plugins.usp.blueToothUniversal.disconnectAll( (status)=>{
            // console.log("Desconectou");
                this.zone.run( ()=>{
                // console.log("Parou de escutar com sucesso");
                });
            },
            error=>{
                this.zone.run( ()=>{
                    console.log( "Falha ao desconectar!");
                });
            }
      );
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad EnviarConfirmacao');
    this.doSubscribe();
    this.storage.ready().then(() => {
      this.storage.get('nusp').then((val) => {
        this.nusp = val;
        this.connect();
      });
    },
    error=>{
      this.utilsService.presentToast( "Falha ao obter NUSP do usuário logado!");
    });
  }


  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.menu.enable(false);
  }


}
