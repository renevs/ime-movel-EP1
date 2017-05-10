import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Alterar } from './alterar';

@NgModule({
  declarations: [
    Alterar,
  ],
  imports: [
    IonicPageModule.forChild(Alterar),
  ],
  exports: [
    Alterar
  ]
})
export class AlterarModule {}
