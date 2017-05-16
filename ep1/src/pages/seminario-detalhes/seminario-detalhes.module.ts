import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeminarioDetalhesPage } from './seminario-detalhes';
import { QRCodeModule } from 'angular2-qrcode';

@NgModule({
  declarations: [
    SeminarioDetalhesPage,
  ],
  imports: [
    IonicPageModule.forChild(SeminarioDetalhesPage),
    QRCodeModule,
  ],
  exports: [
    SeminarioDetalhesPage
  ]
})
export class SeminarioDetalhesModule {}
