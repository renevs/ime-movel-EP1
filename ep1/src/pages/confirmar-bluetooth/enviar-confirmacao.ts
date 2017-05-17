import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import {  NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../../services/utils.service';


import * as BT from '../../app/bluetoothConstants';
declare var cordova: any;

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
  }

  doSubscribe() {
    cordova.plugins.usp.blueToothUniversal.subscribe( data=> {
          this.zone.run( ()=>{
            this.confirmaAcaoSubscriber( data );
          });
    },
    error=>{
        this.confirmaErroSubscriber( error );
    } );

  }

  confirmaAcaoSubscriber( data ) {
    if ( data[ BT.ACTION ] ) {
        if ( data[ BT.ACTION ] == BT.CONNECT ) {
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
    if ( data[ BT.MESSAGE ] && data[BT.MESSAGE] == 'OK' ) {
       this.isOk = true;
    } else {
      this.isOk = false;
    }
    this.stopServer();
  }

  confirmaErroSubscriber( data ) {
      if ( data[ BT.ACTION] ) {
        if ( data[ BT.ACTION ] != BT.CONNECT && data[ BT.ACTION ] != BT.DISCONNECT ) {
          this.stopServer();
        }
      }
  }

  enviaNUSP() {
    cordova.plugins.usp.blueToothUniversal.write(this.mobileAddress, '{"'+BT.VALIDA_NUSP+'":"' + this.nusp + '"}', ( results ) => {
    },
    (error) => {
        this.utilsService.presentToast("Falha ao enviar NUSP para o professor!");
        this.stopServer();
    });
  }

  connect( ) {
    cordova.plugins.usp.blueToothUniversal.connect(this.mobileAddress, (status)=>{
           this.zone.run( ()=>{
           });
      },
      error=>{
        this.zone.run( ()=>{
            this.isOk = false;
            this.utilsService.presentToast( "Falha ao se conectar com o dispositivo do professor! Ele está escutando?");
            this.stopServer();

          } );
        });
  }

  stopServer() {
      this.isSending = false;
      cordova.plugins.usp.blueToothUniversal.disconnectAll( (status)=>{
                this.zone.run( ()=>{
                });
            },
            error=>{
                this.zone.run( ()=>{
                    this.utilsService.presentToast( "Falha ao desconectar!");
                });
            }
      );
  }

  ionViewDidLoad() {
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
