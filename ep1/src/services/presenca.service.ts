import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Ep1ApiService } from '../services/ep1-api.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PresencaService extends Ep1ApiService{
    constructor(private http: Http) {
        super();
    }

    submitPresenca(nusp: string, seminar_id: string): Promise<any> {
        let body = 'nusp=' + nusp + '&seminar_id=' + seminar_id;
        return this.http.post(this.apiUrl + 'attendence/submit', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    listAlunos(seminar_id: string): Promise<any> {
        let body = 'seminar_id=' + seminar_id;
        return this.http.post(this.apiUrl + 'attendence/listStudents', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    listSeminarios(nusp: string): Promise<any> {
        let body = 'nusp=' + nusp;
        return this.http.post(this.apiUrl + 'attendence/listSeminars', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }  
}