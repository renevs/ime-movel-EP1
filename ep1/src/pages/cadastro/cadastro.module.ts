import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPage } from './cadastro';

@NgModule({
  declarations: [
    CadastroPage
  ],
  imports: [
    IonicPageModule.forChild(CadastroPage)
  ],
  entryComponents: [
    CadastroPage
  ]
})
export class CadastroPageModule {}