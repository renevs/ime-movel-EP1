import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, MenuController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AlunoService } from '../../services/aluno.service';
import { ProfessorService } from '../../services/professor.service';
import { UtilsService } from '../../services/utils.service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-alterar',
  templateUrl: 'alterar.html',
})
export class AlterarPage {
  private editarGroup: FormGroup;
  type: string;

  constructor(private utilsService: UtilsService, public menu: MenuController, public events: Events, private storage: Storage, public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private alunoService: AlunoService, private professorService: ProfessorService) {
    this.editarGroup = this.formBuilder.group({
      nusp: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
    this.storage.ready().then(() => {
      this.storage.get('nusp').then((val) => {
        this.editarGroup.patchValue({nusp: (val !== null) ? val : ''});
      }, error => this.utilsService.presentToast('Não foi possível carregar NUSP'));
      this.storage.get('password').then((val) => {
        this.editarGroup.patchValue({password: (val !== null) ? val : ''});
      }, error => this.utilsService.presentToast('Não foi possível carregar Senha'));
      this.storage.get('type').then((val) => {
        this.type = (val !== null) ? val : 'aluno';
      }, error => this.utilsService.presentToast('Não foi possível carregar função'));
      this.storage.get('name').then((val) => {
        this.editarGroup.patchValue({name: (val !== null) ? val : ''});
      }, error => this.utilsService.presentToast('Não foi possível carregar Nome'));
    }, error => this.utilsService.presentToast('Não foi possível carregar informações do usuário'));
  }


  editarForm() {
    switch(this.type) {
      case 'aluno':
        this.alunoService
          .updateAluno(this.editarGroup.value.nusp, this.editarGroup.value.password, this.editarGroup.value.name)
          .then(aluno =>  this.handleUpdate(aluno.success),
                error => this.utilsService.presentToast('Falha no serviço de atualização do aluno'));
        break;
      case 'professor':
        this.professorService
          .addProfessor(this.editarGroup.value.nusp, this.editarGroup.value.password, this.editarGroup.value.name)
          .then(professor =>  this.handleUpdate(professor.success),
                error => this.utilsService.presentToast('Falha no serviço de atualização do professor'));
        break;
      default:
        this.utilsService.presentToast('Não foi identificar função do usuário');
        this.navCtrl.pop();
    }
  }

  handleUpdate(success: boolean) {
    if (success) {
      this.events.publish('user:getNomeNusp', this.editarGroup.value.name, this.editarGroup.value.nusp);
      this.utilsService.presentToast('Conta atualizada com sucesso')
      this.navCtrl.pop();
    }
    else {
      this.utilsService.presentToast('Falha ao editar conta');
    }
  }

  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.menu.enable(false);
  }
}
