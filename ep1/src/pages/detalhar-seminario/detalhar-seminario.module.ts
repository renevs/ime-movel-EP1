import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalharSeminario } from './detalhar-seminario';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    DetalharSeminario,
  ],
  imports: [
    IonicPageModule.forChild(DetalharSeminario),
    QRCodeModule,

  ],
  exports: [
    DetalharSeminario
  ]
})
export class DetalharSeminarioModule {}
