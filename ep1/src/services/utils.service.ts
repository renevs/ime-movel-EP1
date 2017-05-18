import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';

@Injectable()
export class UtilsService {
    constructor(private toastCtrl: ToastController) {
    }

    public presentToast(message: string) {
        let toast = this.toastCtrl.create({
            message: message,
            duration: 3500,
            position: 'bottom',
            cssClass: "toastClass"
        });

        toast.present();
    }
}
