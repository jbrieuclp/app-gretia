import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


import { AppConfig } from '../../../shared/app.config';

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class ApiProjectRepository {

	httpUrlBase: string;
  url_backend: string;
  // constructeur ...
  constructor(protected http: HttpClient) {
    this.httpUrlBase = AppConfig.URL_PROJET;
    this.url_backend = AppConfig.URL_BACKEND;
  }

  /** PUT personnes par ID (cd_nom) **/
  get(id: string, params = {}): Observable<any> {
    const url = `${this.url_backend}${id}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http.get(url, http_options);
  }

  post(id: string, data: any, query_params: any = {}): Observable<any> {
    let getParams = new URLSearchParams(query_params).toString();
    getParams = getParams != '' ? '?' + getParams : '';
    
    const url = `${this.url_backend}${id}${getParams}`;
    let sources; let http_options;
    if (data instanceof FormData) {
      sources = data;
      http_options = Object.assign({}, HTTP_OPTIONS, HTTP_OPTIONS.headers.delete('Content-Type'));
    } else {
      sources = JSON.stringify(data);
      http_options = Object.assign({}, HTTP_OPTIONS);
    }
    return this.http.post(url, sources, http_options);
  }

  patch(id: string, data: any): Observable<any> {
    const url = `${this.url_backend}${id}`;
    const sources = (data instanceof FormData) ? data : JSON.stringify(data);
    const http_options = Object.assign({}, HTTP_OPTIONS);
    return this.http.patch(url, sources, http_options);
  }

  /** PUT personnes par ID (cd_nom) **/
  put(id: string, data: any): Observable<any> {
    const url = `${this.url_backend}${id}`;
    const sources = (data instanceof FormData) ? data : JSON.stringify(data);
    const http_options = Object.assign({}, HTTP_OPTIONS);
    return this.http.put(url, sources, http_options);
  }

  /** DELETE delete Localisation **/
  delete(id, params = {}): Observable<any> {
    const url = `${this.url_backend}${id}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http.delete(url, http_options);
  }

  // /** DELETE personnes par ID (cd_nom) **/
  // delete(category: Category): Observable<Boolean> {
  //   const url = this.httpUrlBase + '/categorie/'+category.id;
  //   const options = {};
  //   return this.http
  //     .delete(url, options)
  //     .pipe( 
  //       map((res: Boolean) => { 
  //         return res;
  //       })
  //       , retry(3)/*, catchError(this.handleError('deleteHero'))*/ );
  // }

}