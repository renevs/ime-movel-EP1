import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlunoService } from '../../services/aluno.service';

@Component({
  templateUrl: 'login.html'
})
export class LoginPage {
  type: string = 'aluno';
  nusp: string = '';
  password: string = '';

  constructor(private alunoService: AlunoService) {
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
