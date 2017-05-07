import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelecionarDispositivo } from './selecionar-dispositivo';

@NgModule({
  declarations: [
    SelecionarDispositivo,
  ],
  imports: [
    IonicPageModule.forChild(SelecionarDispositivo),
  ],
  exports: [
    SelecionarDispositivo
  ]
})
export class SelecionarDispositivoModule {}
