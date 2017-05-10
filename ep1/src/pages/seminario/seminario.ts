import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProfessorService } from '../../services/professor.service';
import { Seminario } from '../../entities/seminario';

@IonicPage()
@Component({
  selector: 'page-seminario',
  templateUrl: 'seminario.html',
})
export class SeminarioPage {
  seminarios: Seminario[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private professorService: ProfessorService) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Seminario');
  }

}
