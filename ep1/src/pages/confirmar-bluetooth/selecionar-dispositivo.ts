import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  NgZone } from '@angular/core';
import { UtilsService } from '../../services/utils.service';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'page-selecionar-dispositivo',
  templateUrl: 'selecionar-dispositivo.html',
})
export class SelecionarDispositivo {
  mobiles: any;
  isVerificando: boolean;
  isOk: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone, private utilsService: UtilsService ) {
    this.isVerificando = true;
    this.isOk = false;
    this.listaSeBluetoothLigado();
  }

  listaSeBluetoothLigado() {
    cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) => {
            this.zone.run( ()=>{
              this.listaBluetoothLigado();
            });
        },
        (error) => {
            this.zone.run( ()=>{
              this.utilsService.presentToast("Erro na obtenção dos dispositivos, bluetooth ligado?" );
            });
        }
    )
  }

  listaBluetoothLigado() {
        cordova.plugins.usp.blueToothUniversal.list(
                (results)=> {
                    this.isVerificando = false;
                    this.isOk = true;
                    this.zone.run( ()=>{
                      this.mobiles =  results;
                    });
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

  itemEscolhido(event, m) {
    this.navCtrl.setRoot( "EnviarConfirmacao", { deviceAddress:m.address } );
  }

}
