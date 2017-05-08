import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import {Platform} from 'ionic-angular';

/**
 * Generated class for the QrcodeSeminario page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-qrcode-seminario',
  templateUrl: 'qrcode-seminario.html',
})
export class QrcodeSeminario {
  idSeminario:number;
  constructor(public navCtrl: NavController, public navParams: NavParams, 
  public platform:Platform, private screenOrientation: ScreenOrientation) {
    this.screenOrientation.lock( this.screenOrientation.ORIENTATIONS.PORTRAIT );
    this.idSeminario = navParams.get('idSeminario');
    console.log('Seminario: '+ this.idSeminario );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QrcodeSeminario');
  }
  qrCodeSize() {
    return this.platform.width()- 10;
  }
  ionViewWillLeave() {
    this.screenOrientation.unlock();
  }

}
