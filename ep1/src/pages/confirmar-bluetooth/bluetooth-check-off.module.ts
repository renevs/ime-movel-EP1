import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BluetoothOff } from './bluetooth-check-off';

@NgModule({
  declarations: [
    BluetoothOff,
  ],
  imports: [
    IonicPageModule.forChild(BluetoothOff),
  ],
  exports: [
    BluetoothOff,
  ]
})
export class BluetoothOffModule {}
