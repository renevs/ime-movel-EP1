import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Platform } from 'ionic-angular';

import { BlueToothAlunoDesligadoPage } from '../blueToothAluno/blueToothAlunoDesligado'


@Component({
  selector: 'blueTooth-aluno',
  templateUrl: 'blueToothAluno.html'
})
export class BlueToothAlunoPage {
  blueToothStatus: any;
  constructor(public navCtrl: NavController, public platform: Platform, public blueTooth:BluetoothSerial) {
    this.initializeApp();
    this.blueToothStatus = true;
    
                    
  }

  initializeApp() {
    
    this.platform.ready().then(() => {
    console.log(this.navCtrl);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.




    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BlueToothAluno');
    this.blueTooth.isEnabled().then( ( results ) =>
                {
                    console.log(results);
                    this.navCtrl.setRoot( "BlueToothAlunoLigadoPage" );
                }, 
                (error) => {
                    console.log(error);
                    this.navCtrl.setRoot( BlueToothAlunoDesligadoPage );
                }
    )
  }

}
