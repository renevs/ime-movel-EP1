import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalharSeminario } from './detalhar-seminario';

@NgModule({
  declarations: [
    DetalharSeminario,
  ],
  imports: [
    IonicPageModule.forChild(DetalharSeminario),
  ],
  exports: [
    DetalharSeminario
  ]
})
export class DetalharSeminarioModule {}
