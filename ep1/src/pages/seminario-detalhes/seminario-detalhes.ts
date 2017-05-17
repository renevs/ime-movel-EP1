import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { PresencaService } from '../../services/presenca.service';
import { AlunoService } from '../../services/aluno.service';
import { UtilsService } from '../../services/utils.service';
import { Aluno } from '../../entities/aluno';
import * as BT from '../../app/bluetoothConstants';

declare var cordova: any;

@Component({
  selector: 'page-seminario-detalhes',
  templateUrl: 'seminario-detalhes.html',
})
export class SeminarioDetalhesPage {
  isListening: boolean;
  seminarioId: string = this.navParams.get('seminarioId');
  seminarioName: string = this.navParams.get('seminarioName');
  type: string = this.navParams.get('type');
  alunos: Array<Aluno> = this.navParams.get('alunos');

  constructor(private utilsService: UtilsService, public navCtrl: NavController, public navParams: NavParams, private alunoService: AlunoService, private presencaService: PresencaService, private zone: NgZone, public platform: Platform) {
    this.isListening = false;
    cordova.plugins.usp.blueToothUniversal.subscribe( data=> {
            this.confirmaAcaoSubscriber( data );
            },
            error=>{
                this.zone.run( ()=>{
                    if ( error[ BT.ACTION ]) {
                        if ( error[ BT.ACTION ] == BT.LISTEN ) {
                            this.utilsService.presentToast( "Escuta interrompida!" );
                            this.stopServer();
                        }
                    }
                } );
            } );
  }

  qrCodeSize() {
      return this.platform.width() / 10;
  }

  confirmaAcaoSubscriber( data ) {
      if ( data[ BT.ACTION ] ) {
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
            this.utilsService.presentToast( "Erro: " + e);
        }
        if ( jsonUSP != null ) {
            this.presencaService
              .submitPresenca(jsonUSP[ BT.VALIDA_NUSP], this.seminarioId )
              .then(dataSent => {
                              if (dataSent.success) {
                                    this.enviaMensagemAluno( data[ BT.DEVICE ], BT.OK_MESSAGE );
                              } else{
                                    this.enviaMensagemAluno( data[ BT.DEVICE ], BT.ERRO_MESSAGE );
                              }
                },
                error => {
                    this.utilsService.presentToast( "falha ao confirmar presença para o NUSP: " + jsonUSP[ BT.VALIDA_NUSP]);
                    this.disconnect( data[ BT.DEVICE ] );
                });


        } else {
            this.disconnect( data[ BT.DEVICE ] );
        }
    }
  }

  enviaMensagemAluno( deviceAddress, status ) {
    cordova.plugins.usp.blueToothUniversal.write(deviceAddress, status, ( results ) => {
        this.disconnect( deviceAddress );
    },
    (error) => {
        this.disconnect( deviceAddress );
    });
  }

  startServer() {
        cordova.plugins.usp.blueToothUniversal.startServer( (status)=>{
                this.isListening = true;
                this.zone.run( ()=>{
                    this.utilsService.presentToast("Escutando alunos");
                });
            },
            error=>{
                this.zone.run( ()=>{
                    this.utilsService.presentToast("Falha ao tentar escutar alunos!");
                }
                );
            });
  }

  ligaBluetooth() {
    cordova.plugins.usp.blueToothUniversal.enable( ( results ) =>
                {
                    this.startServer();
                },
                (error) => {
                    this.utilsService.presentToast( "Bluetooth precisa ser ligado para prosseguir!" );
                }
      )
  }

  disconnect( deviceAddress ) {
      cordova.plugins.usp.blueToothUniversal.disconnect( deviceAddress, (status)=>{}, error=>{});
  }

  stopServer() {
      this.isListening = false;
      cordova.plugins.usp.blueToothUniversal.disconnectAll( (status)=>{
                this.utilsService.presentToast("Desconectou");
                this.zone.run( ()=>{
                });
            },
            error=>{
                this.zone.run( ()=>{
                    this.utilsService.presentToast( "Erro ao parar de escutar!" );
                });
            }
      );
  }

  listenData( event ) {
      cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) => {
                    this.startServer();
                },
                (error) => {
                    this.ligaBluetooth();
                }
      )

  }

  stopListenData( event ) {
      this.stopServer();
  }

  projectQRCode( event ) {
      this.navCtrl.push( "QrcodeSeminario", { idSeminario:this.seminarioId } );
  }

  ligaBluetoothAluno() {
     cordova.plugins.usp.blueToothUniversal.enable( ( results ) => {
                    this.navCtrl.push( "SelecionarDispositivo" );
                },
                (error) => {
                    this.utilsService.presentToast( "Bluetooth precisa ser ligado para prosseguir!" );
                }
      )
  }

  confirmarbluetooth() {
      cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) => {
                  this.navCtrl.push( "SelecionarDispositivo" );
              },
              (error) => {
                  this.ligaBluetoothAluno();
              }
      )
    }
    confirmarQRCode(  event ) {
         this.navCtrl.push( "ConfirmarQrcode" );
    }

   ionViewWillLeave() {
      if ( this.isListening ) {
          this.stopServer();
      }
   }
}
