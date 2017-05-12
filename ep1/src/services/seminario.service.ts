import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Seminario } from '../entities/seminario';
import { Ep1ApiService } from '../services/ep1-api.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SeminarioService extends Ep1ApiService{
    constructor(private http: Http) {
        super();
    }

    getSeminario(): Promise<Seminario[]> {
        return this.http.get(this.apiUrl + 'seminar').toPromise().then(this.extractJsonData).catch(this.handleError);
    }

    searchSeminario(id: string): Promise<Seminario> {
        return this.http.get(this.apiUrl + 'seminar/get/${id}').toPromise().then(this.extractJsonData).catch(this.handleError);
    }

    addSeminario(name: string): Promise<any> {
        let body = 'name=' + name;
        return this.http.post(this.apiUrl + 'seminar/add', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    updateSeminario(id: string, name: string): Promise<any> {
        let body = 'id=' + id + '&name=' + name;
        return this.http.post(this.apiUrl + 'seminar/edit', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    deleteSeminario(id: string): Promise<any> {
        let body = 'id=' + id;
        return this.http.post(this.apiUrl + 'seminar/delete', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }  
}