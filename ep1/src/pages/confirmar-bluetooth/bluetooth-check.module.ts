import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BluetoothCheckPage } from './bluetooth-check';

@NgModule({
  declarations: [
    BluetoothCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothCheckPage),
  ],
  exports: [
    BluetoothCheckPage,
  ]
})
export class BluetoothCheckPageModule {}
