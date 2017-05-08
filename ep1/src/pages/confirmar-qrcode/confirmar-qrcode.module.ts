import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmarQrcode } from './confirmar-qrcode';

@NgModule({
  declarations: [
    ConfirmarQrcode,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmarQrcode),
  ],
  exports: [
    ConfirmarQrcode
  ]
})
export class ConfirmarQrcodeModule {}
