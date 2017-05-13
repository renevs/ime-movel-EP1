import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SeminarioService } from '../../services/seminario.service';
import { Seminario } from '../../entities/seminario';


@IonicPage()
@Component({
  selector: 'page-seminario',
  templateUrl: 'seminario.html',
})
export class SeminarioPage {
  seminarios: Seminario[];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private seminarioService: SeminarioService) {
    this.seminarioService
      .getSeminario()
      .then(seminarios => {
                            this.seminarios = seminarios;
                          } ,
          error => alert(error));
  }

}
