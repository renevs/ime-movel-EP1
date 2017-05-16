import { Injectable } from '@angular/core';
import { Headers, Response, RequestOptions } from '@angular/http';
import { UtilsService } from './utils.service';

@Injectable()
export class Ep1ApiService {
    protected headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    protected apiUrl = 'http://207.38.82.139:8001/';
    protected options = new RequestOptions({ headers: this.headers });

    constructor(public utilsService: UtilsService) {

    }

    protected extractJson(res: Response) {
        return res.json() || { };
    }


    protected extractJsonData(res: Response) {
        return res.json().data || { };
    }
    
    protected handleError (error: Response | any) {
        let errMsg: string;
            if (error instanceof Response) {
                const body = error.json() || '';
                const err = body.error || JSON.stringify(body);
                errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
            } else {
                errMsg = error.message ? error.message : error.toString();
            }
            this.utilsService.presentToast('Erro na chamada de serviço: ' + errMsg);
        return Promise.reject(errMsg);
    }
}