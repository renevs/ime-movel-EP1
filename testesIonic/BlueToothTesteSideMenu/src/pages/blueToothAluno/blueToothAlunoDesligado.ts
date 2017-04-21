import { Component } from '@angular/core';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'blueTooth-aluno-desligado',
  templateUrl: 'blueToothAlunoDesligado.html'
})
export class BlueToothAlunoDesligadoPage {
  constructor(public platform: Platform, public blueTooth:BluetoothSerial) {
  }


}
