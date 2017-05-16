import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PresencaService } from '../../services/presenca.service';
import { AlunoService } from '../../services/aluno.service';
import { UtilsService } from '../../services/utils.service';
import { Aluno } from '../../entities/aluno';
import * as BT from '../../app/bluetoothConstants';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-seminario-detalhes',
  templateUrl: 'seminario-detalhes.html',
})
export class SeminarioDetalhesPage {
  isListening: boolean;
  seminarioId: string = this.navParams.get('seminarioId');
  seminarioName: string = this.navParams.get('seminarioName');
  type: string = this.navParams.get('type');
  alunos: Array<Aluno> = [];

  constructor(private utilsService: UtilsService, public navCtrl: NavController, public navParams: NavParams, private alunoService: AlunoService, private presencaService: PresencaService, private zone: NgZone, public platform: Platform) {
    this.presencaService.listAlunos(this.seminarioId).then((presenca) => {
      for (let p of presenca.data) {
        this.alunoService.searchAluno(p.student_nusp).then((aluno) => this.alunos.push(aluno));
      }
    });

    this.isListening = false;

    cordova.plugins.usp.blueToothUniversal.subscribe( data=> {
            // console.log( JSON.stringify(data));
            // console.log( "leu algo no subscribe" );
            this.confirmaAcaoSubscriber( data );
            },
            error=>{
                this.zone.run( ()=>{
                    // console.log( "erro" + JSON.stringify(error) );
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
            // console.log( "Erro: " + e );
        }
        if ( jsonUSP != null ) {
            // console.log( "Chamando serviço: " + jsonUSP[ BT.VALIDA_NUSP] );
            this.presencaService
              .submitPresenca(jsonUSP[ BT.VALIDA_NUSP], this.seminarioId )
              .then(dataSent => {
                              if (dataSent.success) {
                                    this.enviaMensagemAluno( data[ BT.DEVICE ], BT.OK_MESSAGE );
                              } else{
                                    this.enviaMensagemAluno( data[ BT.DEVICE ], BT.ERRO_MESSAGE );
                                //   console.log( "Não Retornou ok para: " + JSON.stringify( jsonUSP ) );
                                    // this.disconnect( data[ BT.DEVICE ] );
                              }
                },
                error => {
                    console.log( "falha ao confirmar presença para o NUSP: " + jsonUSP[ BT.VALIDA_NUSP]);
                    this.disconnect( data[ BT.DEVICE ] );
                });


        } else {
            console.log( "Erro ao receber número usp do dispositivo: " + data[ BT.DEVICE ] );
            this.disconnect( data[ BT.DEVICE ] );
        }
    }
  }

  enviaMensagemAluno( deviceAddress, status ) {
    cordova.plugins.usp.blueToothUniversal.write(deviceAddress, status, ( results ) =>
    {
        // console.log("Enviou OK");
        // console.log(results);
        this.disconnect( deviceAddress );
    },
    (error) => {

        console.log("Falha ao avisar aluno do resultado!");
        // console.log(error);
        this.disconnect( deviceAddress );
    });
  }

  startServer() {
        cordova.plugins.usp.blueToothUniversal.startServer( (status)=>{
                // console.log("startou o server");

                this.isListening = true;
                this.zone.run( ()=>{
                    console.log("Escutando alunos");
                });
            },
            error=>{
                this.zone.run( ()=>{
                    console.log("Falha ao tentar escutar alunos!");
                    console.log( JSON.stringify(error) );
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
                    console.log( "Bluetooth não ligado!" );
                    // console.log(error);
                    // alert( "Bluetooth está desligado. Ligue e tente novamente!");
                }
      )
  }

  disconnect( deviceAddress ) {
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
                // console.log("PArou de escutar com sucesso");

                });
            },
            error=>{
                this.zone.run( ()=>{
                    console.log("Erro ao parar de escutar");
                });
            }
      );
  }

  listenData( event ) {
      cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) =>
                {
                    // console.log(results);
                    this.startServer();
                },
                (error) => {
                    this.ligaBluetooth();
                    // console.log(error);
                    // alert( "Bluetooth está desligado. Ligue e tente novamente!");
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
     cordova.plugins.usp.blueToothUniversal.enable( ( results ) =>
                {
                    this.navCtrl.push( "SelecionarDispositivo" );
                },
                (error) => {
                    console.log( "Bluetooth não ligado!" );
                    // console.log(error);
                    // alert( "Bluetooth está desligado. Ligue e tente novamente!");
                }
      )
  }


    confirmarbluetooth() {
        cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) =>
                  {
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
}
