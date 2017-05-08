import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlunoService } from '../../services/aluno.service';
import { CadastroPage } from '../cadastro/cadastro';

@IonicPage()
@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
  type: string = 'aluno';
  nusp: string = '';
  password: string = '';
  auto: boolean = false;
  cadastroPage: any;

  constructor(private alunoService: AlunoService, public navCtrl: NavController, public navParams: NavParams) {
    this.cadastroPage = CadastroPage;
  };

  login() {
    switch(this.type) {
      case 'aluno':
        let json = this.alunoService.loginAluno(this.nusp, this.password).then(aluno => alert(aluno.success), error => alert(error));  
        break;
      case 'professor':
        alert('Em desenvolvimento');
        break;
      default:
        alert('Escolha entre aluno e professor');
    } 
  }
}
