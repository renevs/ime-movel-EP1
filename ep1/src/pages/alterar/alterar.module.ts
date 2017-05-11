import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AlterarPage } from './alterar';

@NgModule({
  declarations: [
    AlterarPage,
  ],
  imports: [
    IonicPageModule.forChild(AlterarPage),
  ],
  exports: [
    AlterarPage
  ]
})
export class AlterarModule {}
