import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlunoService } from '../../services/aluno.service';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
    type: string = 'aluno';
    nusp: string = '';
    name: string = '';
    password: string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  registrar() {
    switch(this.type) {
      case 'aluno':
        //let json = this.alunoService.loginAluno(this.nusp, this.password).then(aluno => alert(aluno.success), error => alert(error));  
        break;
      case 'professor':
        alert('Em desenvolvimento');
        break;
      default:
        alert('Escolha entre aluno e professor');
    } 
  }

}
