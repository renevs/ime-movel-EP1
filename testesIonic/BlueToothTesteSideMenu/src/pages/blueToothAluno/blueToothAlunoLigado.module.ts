import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlueToothAlunoLigadoPage } from './blueToothAlunoLigado';

@NgModule({
  declarations: [
    BlueToothAlunoLigadoPage,
  ],
  imports: [
    IonicPageModule.forChild(BlueToothAlunoLigadoPage),
  ],
  exports: [
    BlueToothAlunoLigadoPage,
  ]
})
export class BlueToothAlunoLigadoPageModule {}
