import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { Mission } from './mission.repository';
import { Personne } from './salarie.repository';

import { AppConfig } from '../../../shared/app.config';
import { Projet } from './projet.repository';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

export interface Travailleur {
  projet?: Projet,
  personne?: Personne,
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
  personnes(limit?: number): Observable<Personne[]> {
  	const url = this.httpUrlBase + '/personnes';
  	const options = {};
    return this.http
    	.get(url, options)
    	.pipe(
        map((res: Personne[]) => { 
          return res;
        })
        , retry(3)
	   	);
  }

  /** GET personnes par ID (cd_nom) **/
  get(id: number): Observable<Personne> {
    const url = this.httpUrlBase + '/personne/'+id;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Personne) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getUser(name?: string): Observable<Personne> {
    let urlOption = name === null ? '' :  `/${name}`;
    const url = this.httpUrlBase + `/user${urlOption}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: Personne) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** POST personnes par ID (cd_nom) **/
  post(data: Personne): Observable<Personne> {
    const url = this.httpUrlBase + '/personne';
    const options = JSON.stringify(data);
    return this.http
      .post(url, options)
      .pipe(
        map((res: Personne) => { 
          return res;
        })
       );
  }

  /** PUT personnes par ID (cd_nom) **/
  put(init: Personne, update: Personne): Observable<Personne> {
    const url = this.httpUrlBase + '/personne/'+init.id;
    const options = JSON.stringify(update);
    return this.http
      .put(url, options)
      .pipe(
        map((res: Personne) => { 
          return res;
        })
       );
  }

  /** DELETE personnes par ID (cd_nom) **/
  delete(person: Personne): Observable<Boolean> {
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
  addToProjet(person: Personne, projet: Projet): Observable<Personne[]> {
    const url = this.httpUrlBase + '/personne/'+person.id+'/projet/'+projet.id+'/work';
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Personne[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET all mission **/
  getMissions(person_id: number, limit?: number): Observable<Mission[]> {
    const url = `${this.httpUrlBase}/personne/${person_id}/missions`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Mission[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  getYearDaysInfo(year: number): Observable<any> {
    const url = `${this.httpUrlBase}/days-worked/${year}`;
    return this.http.get(url)
      .pipe(retry(3));
  }
}