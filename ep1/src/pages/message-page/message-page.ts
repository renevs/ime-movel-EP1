import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';

/**
 * Generated class for the MessagePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-message-page',
  templateUrl: 'message-page.html',
})
export class MessagePage {
  msg:string;
  title:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, private menu: MenuController ) {
        this.title = this.navParams.get('title');
        this.msg = this.navParams.get('msg');
  }

  ionViewDidLoad() {
  }


  ionViewWillEnter() {
    this.menu.enable(true);
  }

  ionViewWillLeave() {
    this.menu.enable(false);
  }

}
