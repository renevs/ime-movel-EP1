import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { LoginPage2 } from '../pages/login/login2';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { AlunoService } from '../services/aluno.service';

import { QRCodeModule } from 'angular2-qrcode';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    LoginPage2,
    CadastroPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    QRCodeModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    LoginPage2,
    CadastroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlunoService,
    BarcodeScanner,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
