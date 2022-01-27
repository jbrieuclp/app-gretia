import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Work, Recup, LoadPlan } from './project.interface';

@Injectable()
export class SuiveuseRepository extends ApiProjectRepository {

  /** GET personnes par ID (cd_nom) **/
  dashboard(user?: string): Observable<any> {
    user = user||null
  	const url = `${this.httpUrlBase}/suiveuse/personne/${user}`;
    return this.http
    	.get(url, HTTP_OPTIONS)
    	.pipe(
        map(res => { 
          return res;
        })
        , retry(3)
	   	);
  }

  /** GET personnes par ID (cd_nom) **/
  getMySynthese(params: any): Observable<any[]> {
    const url = `${this.httpUrlBase}/works/me?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: Work[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getMyRecup(params: any): Observable<Recup[]> {
    // const params = Object.keys(options).map(key => key + '=' + options[key]).join('&');
    const url = `${this.httpUrlBase}/recups/me?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: Recup[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET personnes par ID (cd_nom) **/
  getMyParameters(params: any): Observable<any[]> {
    const url = `${this.httpUrlBase}/employee-parameters/me?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: any[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET list of Work **/
  calculateRecup(params = {}): Observable<any[]> {
    const url = `${this.httpUrlBase}/suiveuses/calculate`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: any[]) => res), 
        retry(3)
      );
  }

  /** GET list of Work **/
  cumulative(params = {}): Observable<any[]> {
    const url = `${this.httpUrlBase}/cumulatives`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: any[]) => res), 
        retry(3)
      );
  }

  /** GET list of Work **/
  getCumulativeExport(params = {}): Observable<ArrayBuffer> {
    const url = `${this.httpUrlBase}/cumulatives/export`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params, responseType: 'blob' as 'json'});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: ArrayBuffer) => res)
      );
  }

  /** POST create new LoadPlan **/
  postLoadPlan(data: LoadPlan): Observable<LoadPlan> {
    const url = `${this.httpUrlBase}/load-plans`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

}