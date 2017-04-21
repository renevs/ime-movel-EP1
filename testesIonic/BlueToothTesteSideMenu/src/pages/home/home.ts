import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
/*
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  blueToothStatus: any;
  constructor(public navCtrl: NavController /*, private blueTooth:BluetoothSerial*/) {
    /*blueTooth.isEnabled().then(
                function(results) {
                    console.log(results);
                },
                function(error) {
                    console.log(error);
                }
    )*/
    this.blueToothStatus = true;
  }

}
