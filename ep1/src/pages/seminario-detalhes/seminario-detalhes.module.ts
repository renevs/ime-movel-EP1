import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeminarioDetalhesPage } from './seminario-detalhes';

@NgModule({
  declarations: [
    SeminarioDetalhesPage,
  ],
  imports: [
    IonicPageModule.forChild(SeminarioDetalhesPage),
  ],
  exports: [
    SeminarioDetalhesPage
  ]
})
export class SeminarioDetalhesModule {}
