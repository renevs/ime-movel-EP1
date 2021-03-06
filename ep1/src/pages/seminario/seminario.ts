import { Component } from '@angular/core';
import { NavController, NavParams, Events, MenuController, AlertController } from 'ionic-angular';
import { SeminarioService } from '../../services/seminario.service';
import { ProfessorService } from '../../services/professor.service';
import { PresencaService } from '../../services/presenca.service';
import { AlunoService } from '../../services/aluno.service';
import { UtilsService } from '../../services/utils.service';
import { Seminario } from '../../entities/seminario';
import { Aluno } from '../../entities/aluno';
import { SeminarioDetalhesPage } from '../seminario-detalhes/seminario-detalhes';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-seminario',
  templateUrl: 'seminario.html',
})
export class SeminarioPage {
  seminars: Seminario[];
  type: string = this.navParams.get('type');
  alunosPromises: Array<Promise<Aluno>> = [];

  constructor(private presencaService: PresencaService, private utilsService: UtilsService, private alertCtrl: AlertController, private storage: Storage, public events: Events, public navCtrl: NavController, public navParams: NavParams, public menu: MenuController, private seminarioService: SeminarioService, private alunoService: AlunoService, private professorService: ProfessorService) {
    this.getSeminarios();
    this.getUserName(this.type);
  }

  getSeminarios() {
    this.seminarioService
      .getSeminario()
      .then(seminarios => {
                            this.seminars = seminarios;
                          } ,
          error => this.utilsService.presentToast('Falha ao carregar seminários'));
  }

  getUserName(type: string) {
    switch(type) {
      case 'aluno':
        this.alunoService.searchAluno(this.navParams.get('nusp')).then(aluno => this.setMenuCredentials(aluno.name), error => this.utilsService.presentToast('Falha ao carregar nome do aluno'));
        break;
      case 'professor':
        this.professorService.searchProfessor(this.navParams.get('nusp')).then(professor => this.setMenuCredentials(professor.name), erro => this.utilsService.presentToast('Falha ao carregar nome do professor'));
        break;
      default:
        this.utilsService.presentToast('Falha ao carregar seminários');
        this.navCtrl.setRoot('LoginPage');
    }
  }

  setMenuCredentials(name: string) {
    this.storage.ready().then(() => {
        this.storage.set('name', name).then(() => this.events.publish('user:getNameNusp', name, this.navParams.get('nusp'), this.type), error => this.utilsService.presentToast('Não foi possível obter nome do Storage'))
    }, error => this.utilsService.presentToast('Não foi possível carregar informações do usuário'));
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
                  this.utilsService.presentToast('Seminário adicionado com sucesso');
                  this.getSeminarios();
                }
                else this.utilsService.presentToast('Falha ao adicionar seminário');
              }, error => this.utilsService.presentToast('Falha no serviço de inclusão de seminário'));
            }
          }
        ]
      });
      prompt.present();
  }

  goToDetails(seminario: Seminario) {
    this.presencaService.listAlunos(seminario.id).then((presenca) => {
      if (this.type === 'aluno') {
            this.navCtrl.push(SeminarioDetalhesPage, {
                type: this.type,
                seminarioId: seminario.id,
                seminarioName: seminario.name,
                alunos: [],
                alunosTotal: presenca.data.length
            });
      }
      else {
        for (let p of presenca.data) {
          this.alunosPromises.push(this.alunoService.searchAluno(p.student_nusp));
        }
        Promise.all(this.alunosPromises).then(alunos => {
            this.navCtrl.push(SeminarioDetalhesPage, {
                type: this.type,
                seminarioId: seminario.id,
                seminarioName: seminario.name,
                alunos: alunos,
                alunosTotal: alunos.length
            });
        });
      }
    });
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.menu.enable(false);
  }

}
