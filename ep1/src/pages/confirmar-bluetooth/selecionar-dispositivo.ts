import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {  NgZone } from '@angular/core';
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

  constructor(public navCtrl: NavController, public navParams: NavParams, private zone: NgZone) {
    this.isVerificando = true;
    this.isOk = false;
    this.listaSeBluetoothLigado();
  }

  listaSeBluetoothLigado() {
    console.log( "Verificando se bluetooth estah ligado");
    cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) =>
                {

                    console.log( "bluetooth estah ligado");
                    
                    this.zone.run( ()=>{
                      this.listaBluetoothLigado();
                    });
                }, 
                (error) => {
                    console.log( "bluetooth estah desligado");
                  
                    console.log(error);
                    this.navCtrl.setRoot( "BluetoothOff" );
                }
    )
  }

  listaBluetoothLigado() {
        cordova.plugins.usp.blueToothUniversal.list(
                (results)=> {
                    console.log("Sem erros");
                    this.isVerificando = false;
                    this.isOk = true;
                    this.zone.run( ()=>{
                      this.mobiles =  results;
                    });
                    console.log(results);
                },
                function(error) {
                    this.zone.run( ()=>{
                      this.isOk = false;
                      this.isVerificando = false;
                      console.log("Erro na obtenção dos dispositivos, bluetooth ligado?" + error);
                    });
                }

        );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SelecionarDispositivio');
  }

  itemEscolhido(event, m) {
    console.log( m.address );

    this.navCtrl.setRoot( "EnviarConfirmacao", { deviceAddress:m.address } );
    //this.navCtrl.setRoot( "BlueToothAlunoTransferenciaPage", { m: m } );
  }

}
