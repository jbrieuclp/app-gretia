import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { Personne } from './salarie.repository';
import { Mission } from './mission.repository';

import { AppConfig } from '../../../shared/app.config';

export interface Travail {
  id?: number,
  mission?: any,
  personne?: any,
  date?: Date,
  categorie?: any,
  duree?: number,
  detail?: string
}

export interface TravailCategorie {
  id?: number,
  libelle?: string,
  ordre?: number
}

export interface TRAVAIL_OPTIONS {
  startAt?: string,
  endAt?: string,
  limit?: number
}

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class SuiveuseRepository {

	httpUrlBase: string;
  // constructeur ...
  constructor(private http: HttpClient) {
    this.httpUrlBase = AppConfig.URL_PROJET;
  }

  /** GET personnes par ID (cd_nom) **/
  dashboard(user?: string): Observable<any> {
    user = user||null
  	const url = `${this.httpUrlBase}/suiveuse/personne/${user}`;
    return this.http
    	.get(url, httpOptions)
    	.pipe(
        map(res => { 
          return res;
        })
        , retry(3)
	   	);
  }

  /** GET personnes par ID (cd_nom) **/
  getCategories(limit?: number): Observable<TravailCategorie[]> {
    const url = `${this.httpUrlBase}/suiveuse/categories`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: TravailCategorie[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getSynthese(user: number, options: TRAVAIL_OPTIONS): Observable<any[]> {
    const params = Object.keys(options).map(key => key + '=' + options[key]).join('&');
    const url = `${this.httpUrlBase}/personne/${user}/synthese?${params}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: Travail[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getMySynthese(options: TRAVAIL_OPTIONS): Observable<any[]> {
    const params = Object.keys(options).map(key => key + '=' + options[key]).join('&');
    const url = `${this.httpUrlBase}/works/me?${params}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: Travail[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getTravaux(user: number, options: TRAVAIL_OPTIONS): Observable<Travail[]> {
    const params = Object.keys(options).map(key => key + '=' + options[key]).join('&');
    const url = `${this.httpUrlBase}/personne/${user}/travaux?${params}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: Travail[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getTravail(id_travail: number): Observable<Travail> {
    const url = `${this.httpUrlBase}/travail/${id_travail}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: Travail) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** POST personnes par ID (cd_nom) **/
  postTravail(data: any): Observable<Travail> {
    const url = `${this.httpUrlBase}/travail`;
    const sources = JSON.stringify(data);
    return this.http
      .post(url, sources, httpOptions)
      .pipe(
        map((travail: Travail) => { 
          return travail;
        })
       );
  }

  /** PUT personnes par ID (cd_nom) **/
  putTravail(travail: Travail, data: any): Observable<Travail> {
    const url = `${this.httpUrlBase}/travail/${travail.id}`;
    const sources = JSON.stringify(data);
    return this.http
      .put(url, sources, httpOptions)
      .pipe(
        map((travail: Travail) => { 
          return travail;
        })
       );
  }

  /** DELETE personnes par ID (cd_nom) **/
  deleteTravail(travail: Travail): Observable<Boolean> {
    const url = `${this.httpUrlBase}/travail/${travail.id}`;
    return this.http
      .delete(url, httpOptions)
      .pipe( 
        map((res: Boolean) => { 
          return res;
        })
        , retry(3)/*, catchError(this.handleError('deleteHero'))*/ );
  }

}