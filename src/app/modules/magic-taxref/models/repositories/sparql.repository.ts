import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { debounceTime, map, distinctUntilChanged, switchMap, catchError, retry } from 'rxjs/operators';

import { AppConfig } from '../../../../shared/app.config';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};


@Injectable()
export class SparqlRepository {

  httpUrlBase: string;
  // constructeur ...
  constructor(private http: HttpClient) { }

  /** GET taxon par ID (cd_nom) **/
  getImages(cd_ref: number): Observable<any> {
    const SPARQL_URL = 'https://query.wikidata.org/sparql';

    let query = `SELECT ?image WHERE {
        ?TAXREF_v12_0 wdt:P3186 "${cd_ref}".
        OPTIONAL { ?TAXREF_v12_0 wdt:P18 ?image. }
      }
      LIMIT 100`;

    return this.http
      .get(`${SPARQL_URL}`, {
        params: new HttpParams().set('query', query)
      })
      .pipe(
        map((response: object): any => { 
          return response;
        })
       );
  }
}