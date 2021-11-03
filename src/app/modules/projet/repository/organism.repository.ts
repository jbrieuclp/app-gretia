import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { debounceTime, map, distinctUntilChanged, switchMap, catchError, retry } from 'rxjs/operators';

import { AppConfig } from '../../../shared/app.config';
import { Organism } from './project.interface';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Injectable()
export class OrganismRepository {

	httpUrlBase: string;
  // constructeur ...
  constructor(private http: HttpClient) {
    this.httpUrlBase = AppConfig.URL_PROJET;
  }

  ////////////////////
  //  ORGANISME  //
  ////////////////////
  /** GET list of Organism **/
  organisms(): Observable<Organism[]> {
    const url = `${this.httpUrlBase}/organisms`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Organism[]) => res), 
        retry(3)
      );
  }

  /** POST create new Organism **/
  postOrganisms(data: Organism): Observable<Organism> {
    const url = `${this.httpUrlBase}/organisms`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, httpOptions);
  }

  /** POST update Organism **/
  patchOrganisms(id, data: Organism): Observable<Organism> {
    const url = `${this.httpUrlBase}/organisms/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, httpOptions);
  }

  /** DELETE delete Organism **/
  deleteOrganism(id): Observable<Organism> {
    const url = `${this.httpUrlBase}/organisms/${id}`;
    return this.http.delete(url, httpOptions);
  }

}