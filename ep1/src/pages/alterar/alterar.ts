import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-alterar',
  templateUrl: 'alterar.html',
})
export class AlterarPage {
  private editarGroup: FormGroup;
  type: string;

  constructor(public events: Events, private storage: Storage, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private alunoService: AlunoService, private professorService: ProfessorService) {
    this.editarGroup = this.formBuilder.group({
      nusp: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.storage.ready().then(() => {
      this.storage.get('nusp').then((val) => {
        this.editarGroup.patchValue({nusp: (val !== null) ? val : ''});
      });
      this.storage.get('password').then((val) => {
        this.editarGroup.patchValue({password: (val !== null) ? val : ''});
      });
      this.storage.get('type').then((val) => {
        this.type = (val !== null) ? val : 'aluno';
      });
      this.storage.get('name').then((val) => {
        this.editarGroup.patchValue({name: (val !== null) ? val : ''});
      });
    });
  }


  editarForm() {
    switch(this.type) {
      case 'aluno':
        this.alunoService
          .updateAluno(this.editarGroup.value.nusp, this.editarGroup.value.password, this.editarGroup.value.name)
          .then(aluno =>  this.handleUpdate(aluno.success),
                error => alert(error));
        break;
      case 'professor':
        this.professorService
          .addProfessor(this.editarGroup.value.nusp, this.editarGroup.value.password, this.editarGroup.value.name)
          .then(professor =>  this.handleUpdate(professor.success),
                error => alert(error));
        break;
      default:
        //TODO
    }
  }

  handleUpdate(success: boolean) {
    if (success) {
      this.events.publish('user:getNomeNusp', this.editarGroup.value.name, this.editarGroup.value.nusp);
      this.navCtrl.pop();
    }
    else {
      //TODO
      alert('Não');
    }
  }
}
