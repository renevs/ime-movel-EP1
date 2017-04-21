import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlueToothAlunoTransferenciaPage } from './blue-tooth-aluno-transferencia';

@NgModule({
  declarations: [
    BlueToothAlunoTransferenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(BlueToothAlunoTransferenciaPage),
  ],
  exports: [
    BlueToothAlunoTransferenciaPage
  ]
})
export class BlueToothAlunoTransferenciaPageModule {}