import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { AppConfig } from '../../../shared/app.config';
import { Antenne, Person, Function, Employee, EmployeeParameter, Local } from './project.interface';

@Injectable()
export class EmployeeRepository extends ApiProjectRepository {

  ///////////////
  //  ANTENNE  //
  ///////////////
  /** GET list of Antenne **/
  antennes(): Observable<Antenne[]> {
    const url = `${this.httpUrlBase}/antennes`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Antenne[]) => res), 
        retry(3)
      );
  }

  /** GET list of Antenne **/
  locals(): Observable<Local[]> {
    const url = `${this.httpUrlBase}/locals`;
    const options = {};
    return this.http.get(url, options)
      .pipe(
        map((res: Local[]) => res)
      );
  }

  /** POST create new Antenne **/
  createAntenne(data: Antenne): Observable<Antenne> {
    const url = `${this.httpUrlBase}/antennes`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  
  ////////////////
  //  FONCTION  //
  ////////////////
  /** GET list of Function **/
  functions(): Observable<Function[]> {
    const url = `${this.httpUrlBase}/employee-functions`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Function[]) => res), 
        retry(3)
      );
  }

  /** POST create new Function **/
  createFunction(data: Function): Observable<Function> {
    const url = `${this.httpUrlBase}/employee-functions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }


  ////////////////
  //  PERSONNE  //
  ////////////////
  /** GET list of Person **/
  persons(): Observable<Person[]> {
    const url = `${this.httpUrlBase}/persons`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Person[]) => res), 
        retry(3)
      );
  }

  /** GET list of Person **/
  salaries(): Observable<Employee[]> {
    const url = `${this.httpUrlBase}/salaries`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Employee[]) => res), 
        retry(3)
      );
  }

  /** POST create new Person **/
  createPerson(data: Person): Observable<Person> {
    const url = `${this.httpUrlBase}/persons`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST create new Person **/
  createEmployee(data: Employee): Observable<Employee> {
    const url = `${this.httpUrlBase}/employees`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST add Employee to Person **/
  addContrat(data: Employee): Observable<Person> {
    const personne_id = Number.isInteger(data.person) ? (data.person as number) : (data.person as Person).id;
    const url = `${this.httpUrlBase}/persons/${personne_id}/contrat`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** DELETE remove Employee to Person **/
  removeContrat(personne: Person, employee: Employee): Observable<Person> {
    const url = `${this.httpUrlBase}/persons/${personne.id}/contrat/${employee.id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }

  employeeParameters(params: any = {}): Observable<EmployeeParameter[]> {
    const url = `${this.httpUrlBase}/employee-parameters`;
    // const url = `${this.httpUrlBase}/expenses?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: EmployeeParameter[]) => res),
        retry(3)
       );
  }
  
}