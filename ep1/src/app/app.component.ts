import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { SeminarioPage } from '../pages/seminario/seminario';
import { AlterarPage } from '../pages/alterar/alterar';
import { Storage } from '@ionic/storage';
import { UtilsService } from '../services/utils.service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage:any = LoginPage;
  pages: Array<{title: string, component: any, icon: string}>;
  nome: string;
  nusp: string;
  type: string;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public events: Events, public storage: Storage, private utilsService: UtilsService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.pages = [
      { title: 'Editar Conta', component: AlterarPage, icon: 'contact' },
      { title: 'Logout', component: LoginPage, icon: 'log-out' },
    ];
    events.subscribe('user:getNomeNusp', (nome, nusp, type) => {
      this.nome = nome;
      this.nusp = nusp;
      this.type = type;
    });
  }

  openPage(page) {
    switch(page.component) {
      case LoginPage:
        this.logout();
        break;
      case SeminarioPage:
      case AlterarPage:
        this.nav.setRoot(page.component, {nusp: this.nusp, type: this.type});
        break;
      default:
        this.nav.push(page.component);
    }
  }

  openSeminarios() {
    let page = { title: 'Seminários', component: SeminarioPage, icon: 'list-box' };
    this.openPage(page);
  }

  logout() {
    this.storage.ready().then(() => {
      Promise.all([
        this.storage.remove('nusp'),
        this.storage.remove('type'),
        this.storage.remove('password'),
        this.storage.remove('auto')
      ]).then(() => this.nav.setRoot(LoginPage), error => this.utilsService.presentToast('Não foi possível remover informações do usuário'));
    }, error => this.utilsService.presentToast('Erro ao carregar informações do usuário'));
  }
}
