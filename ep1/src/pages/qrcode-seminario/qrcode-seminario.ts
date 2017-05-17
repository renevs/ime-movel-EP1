import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import {Platform} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-qrcode-seminario',
  templateUrl: 'qrcode-seminario.html',
})
export class QrcodeSeminario {
  idSeminario: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public platform:Platform, private screenOrientation: ScreenOrientation) {
    this.screenOrientation.lock( this.screenOrientation.ORIENTATIONS.PORTRAIT );
    this.idSeminario = navParams.get('idSeminario');
  }

  qrCodeSize() {
    return this.platform.width()*0.95;
  }

  ionViewWillLeave() {
    this.screenOrientation.unlock();
  }

}
