import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';


import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BlueToothAlunoPage } from '../pages/blueToothAluno/blueToothAluno';

import { BlueToothAlunoDesligadoPage } from '../pages/blueToothAluno/blueToothAlunoDesligado';
import { BlueToothProfessorPage } from '../pages/blue-tooth-professor-page/blue-tooth-professor-page';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    BlueToothAlunoPage,
    BlueToothAlunoDesligadoPage,
    BlueToothProfessorPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    BlueToothAlunoPage,
    BlueToothAlunoDesligadoPage,
    BlueToothProfessorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothSerial,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
