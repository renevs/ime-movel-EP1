import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

/**
 * Generated class for the ConfirmarQrcode page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-confirmar-qrcode',
  templateUrl: 'confirmar-qrcode.html',
})
export class ConfirmarQrcode {
  isReading:boolean;
  isCancelled:boolean;
  idSeminario:string;
  isOkSeminario:boolean;
  isOkQRCode:boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner:BarcodeScanner) {
    this.isReading = true;
    this.isOkQRCode = false;
    this.isOkSeminario = false;
    this.isCancelled = false;
    this.readQRCode();
  }

  readQRCode() {
    console.log( "Passou aqui" );
    this.barcodeScanner.scan().then((barcodeData) => {
        this.isOkQRCode = true;
        console.log( JSON.stringify( barcodeData ) );
        console.log( "Seminario: " + barcodeData["text"] );
        if ( barcodeData["cancelled"] ) {
          console.log( "Cancelado." );
          this.isCancelled = true;
          this.isReading = false;
        } else {
          console.log( "Lido." );
          this.idSeminario = barcodeData["text"];
          //TODO: chamar serviço
          this.isOkSeminario = true;
          this.isReading = false;
        }
    }, (err) => {
        this.isReading = false;
        console.log( "Erro ao ler qrcode" );
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ConfirmarQrcode');
  }

}
