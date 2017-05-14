import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PresencaService } from '../../services/presenca.service';

@IonicPage()
@Component({
  selector: 'page-seminario-detalhes',
  templateUrl: 'seminario-detalhes.html',
})
export class SeminarioDetalhesPage {
  seminarioId: string = this.navParams.get('seminarioId');
  seminarioName: string = this.navParams.get('seminarioName');
  type: string = this.navParams.get('type');

  constructor(public navCtrl: NavController, public navParams: NavParams, private presencaService: PresencaService) {
    //TODO
  }

  generateQRCode() {
//TODO
  }

  listenBluetooth() {
//TODO
  }

  confirmQRCode() {
//TODO
  }

  confirmBluetooth() {
//TODO
  }
}