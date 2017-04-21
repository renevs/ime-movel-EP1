import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


/**
 * Generated class for the BlueToothAlunoTransferencia page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-blue-tooth-aluno-transferencia',
  templateUrl: 'blue-tooth-aluno-transferencia.html',
})
export class BlueToothAlunoTransferenciaPage {
  m: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public blueTooth:BluetoothSerial) {
  
    this.m = navParams.get('m');
    console.log( "Conectando em: " + this.m.id );
    blueTooth.connect(this.m.id).subscribe( this.openPort,
        this.showError );
  }

  openPort() {
    console.log( "Conectado. Enviando..." );
    this.blueTooth.write("bla bla bla");
  }

  showError( error ) {
    console.log( error );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlueToothAlunoTransferenciaPage');
    console.log( this.m.id );
  }

}
