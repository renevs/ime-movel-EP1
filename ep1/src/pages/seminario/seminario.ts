import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { SeminarioService } from '../../services/seminario.service';
import { ProfessorService } from '../../services/professor.service';
import { AlunoService } from '../../services/aluno.service';
import { Seminario } from '../../entities/seminario';
import { SeminarioDetalhesPage } from '../seminario-detalhes/seminario-detalhes';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-seminario',
  templateUrl: 'seminario.html',
})
export class SeminarioPage {
  seminarios: Seminario[];
  nome: string = '';
  type: string = this.navParams.get('type');

  constructor(private storage: Storage, public events: Events, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, private seminarioService: SeminarioService, private alunoService: AlunoService, private professorService: ProfessorService) {
    this.seminarioService
      .getSeminario()
      .then(seminarios => {
                            this.seminarios = seminarios;
                          } ,
          error => alert(error));
    this.getUserName(this.type);            
  }

  getUserName(type: string) {
    switch(type) {
      case 'aluno':
        this.alunoService.searchAluno(this.navParams.get('nusp')).then(aluno => this.setMenuCredentials(aluno.name));
        break;
      case 'professor':
        this.professorService.searchProfessor(this.navParams.get('nusp')).then(professor => this.setMenuCredentials(professor.name));
        break;
      default:
        //TODO
    } 
  }

  setMenuCredentials(nome: string) {
    this.storage.ready().then(() => {
        this.storage.set('name', nome).then(() => this.events.publish('user:getNomeNusp', nome, this.navParams.get('nusp')))
    });
  }
  
  addSeminario() {
    //TODO
  }

  goToDetails(seminario: Seminario) {
    // this.navCtrl.push(SeminarioDetalhesPage, {
    this.navCtrl.push("DetalharSeminario", {
      type: this.type,
      seminarioId: seminario.id,
      seminarioName: seminario.name
    });
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.menu.enable(false);
  }

}