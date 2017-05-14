import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';

@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {
  private cadastroGroup: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private alunoService: AlunoService, private professorService: ProfessorService) {
    this.cadastroGroup = this.formBuilder.group({
      type: ['aluno', Validators.required],
      nusp: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  cadastroForm() {
    switch(this.cadastroGroup.value.type) {
      case 'aluno':
        this.alunoService
          .addAluno(this.cadastroGroup.value.nusp, this.cadastroGroup.value.password, this.cadastroGroup.value.name)
          .then(aluno =>  {
                            if (aluno.success) this.navCtrl.pop();
                            else alert("Não");
                          },
                error => alert(error));
        break;
      case 'professor':
        this.professorService
          .addProfessor(this.cadastroGroup.value.nusp, this.cadastroGroup.value.password, this.cadastroGroup.value.name)
          .then(professor =>  {
                                if (professor.success) this.navCtrl.pop();
                                else alert("Não");
                              },
                error => alert(error));
        break;
      default:
        alert('Escolha entre aluno e professor');
    }
  }

}
