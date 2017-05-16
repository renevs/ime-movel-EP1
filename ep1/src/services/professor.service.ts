import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Professor } from '../entities/professor';
import { Ep1ApiService } from '../services/ep1-api.service';
import { UtilsService } from './utils.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProfessorService extends Ep1ApiService {
    constructor(private http: Http, public utilsService: UtilsService) {
        super(utilsService);
    }

    getProfessor(): Promise<Professor[]> {
        return this.http.get(this.apiUrl + 'teacher').toPromise().then(this.extractJsonData).catch(this.handleError);
    }

    searchProfessor(nusp: string): Promise<Professor> {
        return this.http.get(this.apiUrl + 'teacher/get/' + nusp).toPromise().then(this.extractJsonData).catch(this.handleError);
    }

    loginProfessor(nusp: string, pass: string): Promise<any> {
        let body = 'nusp=' + nusp + '&pass=' + pass ;
        return this.http.post(this.apiUrl + 'login/teacher', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    addProfessor(nusp: string, pass: string, name: string): Promise<any> {
        let body = 'nusp=' + nusp + '&pass=' + pass + '&name=' + name;
        return this.http.post(this.apiUrl + 'teacher/add', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    updateProfessor(nusp: string, pass: string, name: string): Promise<any> {
        let body = 'nusp=' + nusp + '&pass=' + pass + '&name=' + name;
        return this.http.post(this.apiUrl + 'teacher/edit', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    deleteProfessor(nusp: string): Promise<any> {
        let body = 'nusp=' + nusp;
        return this.http.post(this.apiUrl + 'teacher/delete', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }  
}