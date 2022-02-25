import { Injectable, ElementRef } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, retry, map } from 'rxjs/operators';

import * as _ from 'lodash';

import { AppConfig } from '../../../shared/app.config';

const httpOptions = {
  headers: new HttpHeaders({
    'Authorization': 'my-auth-token',
    'Content-Type':  'application/json',
  })
};

@Injectable()
export class ImportService {

  httpUrlBase: string;
  url_backend: string;

  constructor( 
  	private http: HttpClient,
  ) {
  	this.httpUrlBase = AppConfig.URL_API_IMPORT;
    this.url_backend = AppConfig.URL_BACKEND;
  }

  /** PUT personnes par ID (cd_nom) **/
  get(iri: string, params = {}): Observable<any> {
    const url = `${this.url_backend}${iri}`;
    const http_options = Object.assign({}, httpOptions, {params: params});
    return this.http.get(url, http_options);
  }

  post(iri: string, data: any, query_params: any = {}): Observable<any> {
    let getParams = new URLSearchParams(query_params).toString();
    getParams = getParams != '' ? '?' + getParams : '';
    
    const url = `${this.url_backend}${iri}${getParams}`;
    let sources; let http_options;
    if (data instanceof FormData) {
      sources = data;
      http_options = Object.assign({}, httpOptions, httpOptions.headers.delete('Content-Type'));
    } else {
      sources = JSON.stringify(data);
      http_options = Object.assign({}, httpOptions);
    }
    return this.http.post(url, sources, http_options);
  }

  patch(iri: string, data: any): Observable<any> {
    const url = `${this.url_backend}${iri}`;
    const sources = (data instanceof FormData) ? data : JSON.stringify(data);
    const http_options = Object.assign({}, httpOptions);
    return this.http.patch(url, sources, http_options);
  }

  /** PUT personnes par ID (cd_nom) **/
  put(iri: string, data: any): Observable<any> {
    const url = `${this.url_backend}${iri}`;
    const sources = (data instanceof FormData) ? data : JSON.stringify(data);
    const http_options = Object.assign({}, httpOptions);
    return this.http.put(url, sources, http_options);
  }

  /** DELETE delete Localisation **/
  delete(iri, params = {}): Observable<any> {
    const url = `${this.url_backend}${iri}`;
    const http_options = Object.assign({}, httpOptions, {params: params});
    return this.http.delete(url, http_options);
  }

  /**************
  *
  *  Lien API
  *
  ***************/

  /** GET taxon par ID (cd_nom) **/
  updloadFile(data: any): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers`;
    let sources; let http_options;
    if (data instanceof FormData) {
      sources = data;
      http_options = Object.assign({}, httpOptions, httpOptions.headers.delete('Content-Type'));
    } else {
      sources = JSON.stringify(data);
      http_options = Object.assign({}, httpOptions);
    }
    return this.http
      .post(url, data, http_options)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getFiles(params: any = {}): Observable<any> {
    const http_options = Object.assign({}, httpOptions, {params: params});
    const url = `${this.httpUrlBase}/fichiers`;
    return this.http
      .get(url, http_options)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getFichier(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  countRow(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/count`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  addField(id: number, params: any): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/add-field`;
    const sources = params;
    return this.http
      .post(url, sources, httpOptions)
      .pipe(
        map(res => res), 
      );
  }

  /** GET taxon par ID (cd_nom) **/
  patchField(id: number, params: any): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}`;
    const sources = params;
    return this.http
      .patch(url, sources, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  patchFieldValue(id: number, params: any): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}/value`;
    const sources = params;
    return this.http
      .patch(url, sources, httpOptions)
      .pipe(
        map(res => res), 
      );
  }

  /** GET taxon par ID (cd_nom) **/
  updateFieldValues(id: number, params: any[]): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}/values`;
    const sources = params;
    return this.http
      .post(url, sources, httpOptions)
      .pipe(
        map(res => res), 
      );
  }

  /** GET taxon par ID (cd_nom) **/
  replaceFieldElement(id: number, params: any, returnList: 't'|'f' = 't'): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}/replace?values=${returnList}`;
    let sources = params;
    return this.http
      .patch(url, sources, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  regexpReplaceFieldElement(id: number, params: any, returnList: 't'|'f' = 't'): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}/regexp-replace?values=${returnList}`;
    let sources = params;
    return this.http
      .patch(url, sources, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  replaceEmptyByField(id: number, replacement_id: number, returnList: 't'|'f' = 't'): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}/replace-empty-by/${replacement_id}?values=${returnList}`;
    return this.http
      .patch(url, {}, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getFields(id: number, mapped: boolean = false): Observable<any> {
    let url = `${this.httpUrlBase}/fichiers/${id}/fields`;
    if (mapped) {
      url = url+'?only-mapped=true';
    }
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => {
          res['hydra:member'] = res['hydra:member'].map(e => {
            e.id = e.id === -9999 ? null : e.id;
            return e; 
          });
          return res;
        }), 
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getFSDFields(): Observable<any> {
    const url = `${this.httpUrlBase}/database-fields`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getFieldByFSD(id: number, champ: string): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/field-by-fsd`;
    const params = { params: new HttpParams().set('champ', champ) };
    return this.http
      .get(url, params)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getFSDFieldValues(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/database-fields/${id}/values`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
      );
  }

  searchFSDValues(id: number, term: string): Observable<any>  {
    const taxonUrl = `${this.httpUrlBase}/database-fields/${id}/recherche`;
    const options = term ? 
     { params: new HttpParams().set('term', term) } : {};

    return this.http
        .get(taxonUrl, options)
        .pipe(
          map(response => response),
          retry(3)
        );
  }

  /** Mappe un champ non mappé **/
  postField(fichier_id: number, params): Observable<any> {
    const url = `${this.httpUrlBase}/fields`;
    const sources = params;
    return this.http
     .post(url, sources, httpOptions)
     .pipe(
       map(res => res), 
     );
  }

  /** MAJ d'un champ mappé **/
  patchFieldFSD(field_id: number, fsd_id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${field_id}/fsd/${fsd_id}`;
    const sources = {};
    return this.http
     .patch(url, sources, httpOptions)
     .pipe(
       map(res => res), 
       retry(3)
     );
  }

  /** DELETE field par ID **/
  deleteField(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}`;
    return this.http
      .delete(url, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      )
  }

  /** GET taxon par ID (cd_nom) **/
  getFieldValues(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}/values`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getFieldsValues(fields_id: number[]): Observable<any> {
    const params = fields_id.map(field_id => 'fields[]=' + field_id).join('&');
    const url = `${this.httpUrlBase}/localisation/values?${params}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getObservers(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fields/${id}/observers`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  createObserver(params: any): Observable<any> {
    const url = `${this.httpUrlBase}/observer`;
    const sources = params;
    return this.http
      .post(url, sources, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }


  /** GET taxon par ID (cd_nom) **/
  getLocalisationValues(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/localisations`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
        retry(3)
      );
  }

  /** Mappe un champ non mappé **/
  tableView(fichier_id: number, params, sort, direction, index, limit): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/view?sort=${sort}&direction=${direction}&index=${index}&limit=${limit}`;
    const sources = params;
    return this.http
     .post(url, sources, httpOptions)
     .pipe(
       map(res => res)
     );
  }

  /** Mappe un champ non mappé **/
  patchTableCell(fichier_id: number, row_id: number, params: any = {}): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/row/${row_id}`;
    const sources = params;
    return this.http
     .patch(url, sources, httpOptions)
     .pipe(
       map(res => res), 
       retry(3)
     );
  }

  /** Recherche les lignes en doublons dans le fichier **/
  checkDuplicateLines(fichier_id: number, fields): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/duplicate-lines/check`;
    const sources = fields;
    return this.http
     .post(url, sources, httpOptions)
     .pipe(
       map(res => res), 
       retry(3)
     );
  }

  /** Marque les lignes en doublons dans le fichier **/
  tagDuplicateLines(fichier_id: number, fields): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/duplicate-lines/tag`;
    const sources = fields;
    return this.http
     .post(url, sources, httpOptions)
     .pipe(
       map(res => res), 
       retry(3)
     );
  }

  /** Recherche les lignes en doublons avec GeoNature **/
  checkExistsInDB(fichier_id: number, fields): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/exists-in-db/check`;
    const sources = fields;
    return this.http
     .post(url, sources, httpOptions)
     .pipe(
       map(res => res), 
       retry(3)
     );
  }

  /** Marque les lignes en doublons avec GeoNature **/
  tagExistsInDB(fichier_id: number, fields): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/exists-in-db/tag`;
    const sources = fields;
    return this.http
     .post(url, sources, httpOptions)
     .pipe(
       map(res => res), 
       retry(3)
     );
  }

  /** GET taxon par ID (cd_nom) **/
  getRegrouping(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/releves/info`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  setRegrouping(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/regrouping`;
    return this.http
      .post(url, {}, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  setOberversIds(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/observers/set-id`;
    return this.http
      .post(url, {}, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  switchStatus(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/switch-status`;
    return this.http
      .post(url, {}, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getLocalisationsInfo(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/localisations/info`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  getLocalisationsGeoms(id: number): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${id}/localisations/geoms`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  postLocalisationGeom(fichier_id: number, location: any): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/localisation`;
    return this.http.post(url, location, httpOptions);
  }

  /** GET taxon par ID (cd_nom) **/
  postTaxrefMatch(taxons: any): Observable<any> {
    const url = `${AppConfig.URL_API_MT}/name-checker`;
    const sources = taxons;
    return this.http
      .post(url, sources, httpOptions)
      .pipe(
        map(res => res), 
       // retry(3)
      );
  }

  /** GET taxon par ID (cd_nom) **/
  searchCommune(term): Observable<any> {
    const url = `${this.httpUrlBase}/communes?q=${term}`;
    return this.http
      .get(url);
  }

  /** GET taxon par ID (cd_nom) **/
  postCoordsToPoint(fichier_id, coords: any[]): Observable<any> {
    const url = `${this.httpUrlBase}/fichiers/${fichier_id}/coords-to-point`;
    const sources = {data: coords};
    return this.http.post(url, sources, httpOptions);
  }

}
