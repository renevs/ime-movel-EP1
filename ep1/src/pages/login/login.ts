import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';
import { CadastroPage } from '../cadastro/cadastro';

@IonicPage()
@Component({
  templateUrl: 'login.html'
})

export class LoginPage {
  private loginGroup: FormGroup;
  cadastroPage: any;

  constructor(private formBuilder: FormBuilder, private alunoService: AlunoService, private professorService: ProfessorService, public navCtrl: NavController, public navParams: NavParams) {
    this.cadastroPage = CadastroPage;
    this.loginGroup = this.formBuilder.group({
      type: ['aluno', Validators.required],
      nusp: ['', Validators.required],
      password: ['', Validators.required],
      auto:[false]
    });
  };

  login() {
    switch(this.loginGroup.value.type) {
      case 'aluno':
        this.alunoService.loginAluno(this.loginGroup.value.nusp, this.loginGroup.value.password).then(aluno => alert(aluno.success), error => alert(error));
        break;
      case 'professor':
        this.professorService.loginProfessor(this.loginGroup.value.nusp, this.loginGroup.value.password).then(professor => alert(professor.success), error => alert(error));
        break;
      default:
        alert('Escolha entre aluno e professor');
    }
  }
}
