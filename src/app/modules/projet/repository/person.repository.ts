import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { Person, Study } from './project.interface';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

export interface Travailleur {
  projet?: Study,
  personne?: Person,
  temps?: number
}

@Injectable()
export class PersonRepository {

	httpUrlBase: string;
  // constructeur ...
  constructor(private http: HttpClient) {
    this.httpUrlBase = AppConfig.URL_PROJET;
  }

  /** GET personnes par ID (cd_nom) **/
  personnes(limit?: number): Observable<Person[]> {
  	const url = this.httpUrlBase + '/persons';
  	const options = {};
    return this.http
    	.get(url, options)
    	.pipe(
        map((res: Person[]) => { 
          return res;
        })
        , retry(3)
	   	);
  }

  /** GET personnes par ID (cd_nom) **/
  get(id: number): Observable<Person> {
    const url = this.httpUrlBase + '/person/'+id;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Person) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getUser(name?: string): Observable<Person> {
    let urlOption = name === null ? '' :  `/${name}`;
    const url = this.httpUrlBase + `/user${urlOption}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: Person) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** POST personnes par ID (cd_nom) **/
  post(data: Person): Observable<Person> {
    const url = this.httpUrlBase + '/personne';
    const options = JSON.stringify(data);
    return this.http
      .post(url, options)
      .pipe(
        map((res: Person) => { 
          return res;
        })
       );
  }

  /** PUT personnes par ID (cd_nom) **/
  put(init: Person, update: Person): Observable<Person> {
    const url = this.httpUrlBase + '/personne/'+init.id;
    const options = JSON.stringify(update);
    return this.http
      .put(url, options)
      .pipe(
        map((res: Person) => { 
          return res;
        })
       );
  }

  /** DELETE personnes par ID (cd_nom) **/
  delete(person: Person): Observable<Boolean> {
    const url = this.httpUrlBase + '/personne/'+person.id;
    const options = {};
    return this.http
      .delete(url, options)
      .pipe( 
        map((res: Boolean) => { 
          return res;
        })
        , retry(3)/*, catchError(this.handleError('deleteHero'))*/ );
  }

  /** GET personnes par ID (cd_nom) **/
  addToStudy(person: Person, projet: Study): Observable<Person[]> {
    const url = this.httpUrlBase + '/personne/'+person.id+'/projet/'+projet.id+'/work';
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Person[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  getYearDaysInfo(params = {}): Observable<any> {
    const url = `${this.httpUrlBase}/days-worked`;
    const options = {params: params};
    return this.http.get(url, options)
      .pipe(retry(3));
  }

  getWorkedDaysRepartition(person: number, year: number): Observable<any> {
    const url = `${this.httpUrlBase}/worked-days-repartition/${person}/${year}`;
    return this.http.get(url)
      .pipe(retry(3));
  }
}