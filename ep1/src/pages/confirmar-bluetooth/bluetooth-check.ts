import { Component } from '@angular/core';

import { IonicPage, NavController } from 'ionic-angular';

declare var cordova: any;

@IonicPage()
@Component({
  selector: 'bluetooth-check',
  templateUrl: 'bluetooth-check.html'
})
export class BluetoothCheckPage {
  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    cordova.plugins.usp.blueToothUniversal.isEnabled( ( results ) =>{
              console.log(results);
              this.navCtrl.setRoot( "EnviarConfirmacao" );
          },
          (error) => {
              console.log(error);
              this.navCtrl.setRoot( "BluetoothOff" );
          }
    )
  }

}
