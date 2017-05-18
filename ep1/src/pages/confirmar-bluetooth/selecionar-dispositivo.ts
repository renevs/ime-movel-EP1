import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  NgZone } from '@angular/core';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../../services/utils.service';
import * as BT from '../../app/bluetoothConstants';

declare var cordova: any;


/**
 * Generated class for the SelecionarDispositivio page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-selecionar-dispositivo',
  templateUrl: 'selecionar-dispositivo.html',
})
export class SelecionarDispositivo {
  mobiles: any;
  isVerificando: boolean;
  isOk: boolean;
  isOkSent: boolean;
  seminarId:string;
  nusp:string;
  isSending:boolean;
  mobileAddress:any;
  messageWritten:boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, private utilsService: UtilsService,
    private storage: Storage ) {
    this.isVerificando = true;
    this.isOk = false;
    this.seminarId = this.navParams.get('seminarId');
    this.listaSeBluetoothLigado();
  }

  listaSeBluetoothLigado() {
    // console.log( "Verificando se bluetooth estah ligado");
    cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) =>
                {

                    // console.log( "bluetooth estah ligado");
                    
                    this.zone.run( ()=>{
                      this.listaBluetoothLigado();
                    });
                }, 
                (error) => {
                    // console.log( "bluetooth estah desligado");
                  
                    // console.log(error);
                    // this.navCtrl.setRoot( "BluetoothOff" );
                    this.zone.run( ()=>{
                      this.utilsService.presentToast("Erro na obtenção dos dispositivos, bluetooth ligado?" );
                    });
                }
    )
  }

  listaBluetoothLigado() {
        cordova.plugins.usp.blueToothUniversal.list(
                (results)=> {
                    // console.log("Sem erros");
                    this.isVerificando = false;
                    this.isOk = true;
                    this.zone.run( ()=>{
                      this.mobiles =  results;
                    });
                    // console.log(results);
                },
                function(error) {
                    this.zone.run( ()=>{
                      this.isOk = false;
                      this.isVerificando = false;
                      this.utilsService.presentToast("Erro na obtenção dos dispositivos, bluetooth ligado?" + error);
                    });
                }

        );
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SelecionarDispositivio');
  }

  itemEscolhido(event, m) {
    // console.log( m.address );

    // this.navCtrl.setRoot( "EnviarConfirmacao", { deviceAddress:m.address } );
    //this.navCtrl.setRoot( "BlueToothAlunoTransferenciaPage", { m: m } );
    this.mobileAddress = m.address;
    this.enviaConfirmacao();
  }


  //*********ENVIANDO************************************************************************ */

  doSubscribe() {
    this.messageWritten =false;
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
    this.isOkSent = true;
    if ( data[ BT.MESSAGE ] ) {
      if ( data[BT.MESSAGE] == BT.OK_MESSAGE ) {
         this.sendMsgAndReturn( "Registrado no seminário com sucesso!");
      } else if ( data[BT.MESSAGE] == BT.ERRO_SEMINARIO_MESSAGE ) {
         this.sendMsgAndReturn( "O seminário não corresponde ao seminário do professor!");
      } else {
         this.sendMsgAndReturn( "Falha ao registrar-se no seminário!");
      }
    } else {
         this.sendMsgAndReturn( "Falha ao registrar-se no seminário!");
    }
    this.stopServer();
  }

  confirmaErroSubscriber( data ) {
      if ( data[ BT.ACTION] ) { // eh um json no padrao
        if ( data[ BT.ACTION ] != BT.CONNECT && data[ BT.ACTION ] != BT.DISCONNECT ) {         
          this.stopServer();
          if ( !this.isOkSent && !(data[ BT.RESULT ] == BT.READ && data[ BT.RESULT ] == BT.BLUETOOTH_SOCKET_CLOSED_BY_YOURSELF) ) {
            this.sendMsgAndReturn( "Falha ao comunicar-se com o professor!");
          }
        }
      } else {
          this.sendMsgAndReturn( "Falha ao comunicar-se com o professor!");
      }
  }

  enviaNUSP() {
    // console.log("Enviando NUSP" );
    cordova.plugins.usp.blueToothUniversal.write(this.mobileAddress, '{"'+BT.VALIDA_NUSP+'":"' + this.nusp + '","'+BT.VALIDA_SEMINARIO_ID+'":"' + this.seminarId + '"}', ( results ) =>
    {
        // console.log("Enviou");
        // console.log(results);
    }, 
    (error) => {

        // console.log(error);
        this.stopServer();
        if ( !this.isOkSent ) {
          this.sendMsgAndReturn("Falha ao enviar NUSP para o professor!");
        }
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
            this.stopServer();
            this.sendMsgAndReturn( "Falha ao se conectar com o dispositivo do professor! Ele está escutando?");

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

  enviaConfirmacao() {
    this.isOkSent = false;
    // console.log('ionViewDidLoad EnviarConfirmacao');
    this.doSubscribe();
    this.storage.ready().then(() => {
      this.storage.get('nusp').then((val) => {
        this.nusp = val;
        this.connect();
      });
    },
    error=>{
      this.sendMsgAndReturn( "Falha ao obter NUSP do usuário logado!");
    });
  }


  sendMsgAndReturn( msg ) {
      if ( !this.messageWritten ) {
        this.messageWritten = true;
        this.utilsService.presentToast(  msg );
        this.navCtrl.pop();
      }
  }


}
