import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EnviarConfirmacao } from './enviar-confirmacao';

@NgModule({
  declarations: [
    EnviarConfirmacao,
  ],
  imports: [
    IonicPageModule.forChild(EnviarConfirmacao),
  ],
  exports: [
    EnviarConfirmacao
  ]
})
export class EnviarConfirmacaoModule {}
