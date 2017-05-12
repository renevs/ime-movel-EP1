import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CadastroPage } from '../cadastro/cadastro';

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class Menu {

  seminarioPage: any = CadastroPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

}
