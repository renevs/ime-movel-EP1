import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PresencaService } from '../../services/presenca.service';
import { AlunoService } from '../../services/aluno.service';
import { Aluno } from '../../entities/aluno';

@IonicPage()
@Component({
  selector: 'page-seminario-detalhes',
  templateUrl: 'seminario-detalhes.html',
})
export class SeminarioDetalhesPage {
  seminarioId: string = this.navParams.get('seminarioId');
  seminarioName: string = this.navParams.get('seminarioName');
  type: string = this.navParams.get('type');
  alunos: Array<Aluno> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private alunoService: AlunoService, private presencaService: PresencaService) {
    this.presencaService.listAlunos(this.seminarioId).then((presenca) => {
      for (let p of presenca.data) {
        this.alunoService.searchAluno(p.student_nusp).then((aluno) => this.alunos.push(aluno));           
      }
    });     
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