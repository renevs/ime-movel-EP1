import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Seminario } from './seminario';

@NgModule({
  declarations: [
    Seminario,
  ],
  imports: [
    IonicPageModule.forChild(Seminario),
  ],
  exports: [
    Seminario
  ]
})
export class SeminarioModule {}
