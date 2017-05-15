import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController, AlertController } from 'ionic-angular';
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

  constructor(private alertCtrl: AlertController, private storage: Storage, public events: Events, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, private seminarioService: SeminarioService, private alunoService: AlunoService, private professorService: ProfessorService) {
    this.getSeminarios();
    this.getUserName(this.type);            
  }

  getSeminarios() {
    this.seminarioService
      .getSeminario()
      .then(seminarios => {
                            this.seminarios = seminarios;
                          } ,
          error => alert(error));
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
      let prompt = this.alertCtrl.create({
        title: "Adicionar um Seminário",
        inputs: [
          {
            name: 'seminarioName',
            placeholder: 'Nome do Seminário'
          },
        ],
        buttons: [
          {
            text: 'Cancelar'
          },
          {
            text: 'Ok',
            handler: data => {
              this.seminarioService.addSeminario(data.seminarioName).then((response) => {
                if (response.success) {
                  console.log('add');
                  this.getSeminarios();
                }
                else console.log('nops');
              });
            }
          }
        ]
      });
      prompt.present();
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