import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { PresencaService } from '../../services/presenca.service';
import { Storage } from '@ionic/storage';


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
  seminarioId:string;
  isOkSeminario:boolean;
  isOkQRCode:boolean;
  nusp:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner:BarcodeScanner, private presencaService: PresencaService,
    private storage: Storage ) {
    this.isReading = true;
    this.isOkQRCode = false;
    this.isOkSeminario = false;
    this.isCancelled = false;
    this.iniciaAposLerNumUSP();
  }

  readQRCode() {
    // console.log( "Passou aqui" );
    this.barcodeScanner.scan().then((barcodeData) => {
        this.isOkQRCode = true;
        // console.log( JSON.stringify( barcodeData ) );
        // console.log( "Seminario: " + barcodeData["text"] );
        if ( barcodeData["cancelled"] ) {
          // console.log( "Cancelado." );
          this.isCancelled = true;
          this.isReading = false;
        } else {
          // console.log( "Lido." );
          this.seminarioId = barcodeData["text"];
          this.presencaService
              .submitPresenca(this.nusp, this.seminarioId )
              .then(dataSent => {
                    this.isOkSeminario = dataSent.success;
                    this.isReading = false;
                },
                error => {
                    this.isOkSeminario = false;
                    this.isReading = false;

                });
          
        }
    }, (err) => {
        this.isOkSeminario = false;
        this.isReading = false;
        console.log( "Erro ao ler qrcode" );
    });

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ConfirmarQrcode');

  }

  iniciaAposLerNumUSP() {
    this.storage.ready().then(() => {
        this.storage.get('nusp').then((val) => {
          this.nusp = val;
          this.readQRCode();
        });
      },
      error=>{
        this.isOkSeminario = false;
        this.isReading = false;
        console.log( "Falha ao obter usuário logado");
      });
  }
}
