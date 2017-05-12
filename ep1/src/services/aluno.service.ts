import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Aluno } from '../entities/aluno';
import { Ep1ApiService } from '../services/ep1-api.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AlunoService extends Ep1ApiService {
    constructor(private http: Http) {
        super();
    }

    getAlunos(): Promise<Aluno[]> {
        return this.http.get(this.apiUrl + 'student').toPromise().then(this.extractJsonData).catch(this.handleError);
    }

    searchAluno(nusp: string): Promise<Aluno> {
        return this.http.get(this.apiUrl + 'student/get/${nusp}').toPromise().then(this.extractJsonData).catch(this.handleError);
    }

    loginAluno(nusp: string, pass: string): Promise<any> {
        let body = 'nusp=' + nusp + '&pass=' + pass ;
        return this.http.post(this.apiUrl + 'login/student', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    addAluno(nusp: string, pass: string, name: string): Promise<any> {
        let body = 'nusp=' + nusp + '&pass=' + pass + '&name=' + name;
        return this.http.post(this.apiUrl + 'student/add', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }
    
    updateAluno(nusp: string, pass: string, name: string): Promise<any> {
        let body = 'nusp=' + nusp + '&pass=' + pass + '&name=' + name;
        return this.http.post(this.apiUrl + 'student/edit', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }

    deleteAluno(nusp: string): Promise<any> {
        let body = 'nusp=' + nusp;
        return this.http.post(this.apiUrl + 'student/delete', body, this.options).toPromise().then(this.extractJson).catch(this.handleError);
    }  
}
