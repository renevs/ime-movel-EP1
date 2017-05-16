import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { SeminarioPage } from '../pages/seminario/seminario';
import { AlterarPage } from '../pages/alterar/alterar';
import { SeminarioDetalhesPage } from '../pages/seminario-detalhes/seminario-detalhes';

import { AlunoService } from '../services/aluno.service';
import { ProfessorService } from '../services/professor.service';
import { SeminarioService } from '../services/seminario.service';
import { PresencaService } from '../services/presenca.service';
import { UtilsService } from '../services/utils.service';
import { QRCodeModule } from 'angular2-qrcode';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    CadastroPage,
    AlterarPage,
    SeminarioPage,
    SeminarioDetalhesPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    QRCodeModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    CadastroPage,
    AlterarPage,
    SeminarioPage,
    SeminarioDetalhesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AlunoService,
    ProfessorService,
    SeminarioService,
    PresencaService,
    UtilsService,
    BarcodeScanner,
    ScreenOrientation,
    IonicStorageModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
