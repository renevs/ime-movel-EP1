import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrcodeSeminario } from './qrcode-seminario';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    QrcodeSeminario,
  ],
  imports: [
    IonicPageModule.forChild(QrcodeSeminario),
    QRCodeModule,
  ],
  exports: [
    QrcodeSeminario
  ]
})
export class QrcodeSeminarioModule {}
