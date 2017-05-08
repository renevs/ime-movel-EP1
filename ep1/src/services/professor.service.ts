import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Ep1ApiService } from '../services/ep1-api.service';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProfessorService extends Ep1ApiService {
  constructor(private http: Http) {
      super();
  }

  loginProfessor(nusp: string, pass: string): Promise<any> {
      let body = 'nusp=' + nusp + '&pass=' + pass ;
      return this.http.post(this.apiUrl + 'login/teacher', body, this.options).toPromise().then(this.extractData).catch(this.handleError);
  }

  addProfessor(nusp: string, pass: string, name: string): Promise<any> {
      let body = 'nusp=' + nusp + '&pass=' + pass + '&name=' + name;
      return this.http.post(this.apiUrl + 'teacher/add', body, this.options).toPromise().then(this.extractData).catch(this.handleError);
  }
}
