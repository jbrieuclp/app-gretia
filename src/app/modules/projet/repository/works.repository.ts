import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Action, Employee, Work } from './project.interface';


@Injectable()
export class WorksRepository extends ApiProjectRepository {

  ////////////////////
  //  CONVENTIONS  //
  ////////////////////
  /** GET list of Work **/
  works(params = {}): Observable<Work[]> {
    const url = `${this.httpUrlBase}/works`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Work[]) => res), 
        retry(3)
      );
  }

  /** GET list of Work **/
  myWorks(params = {}): Observable<Work[]> {
    const url = `${this.httpUrlBase}/works/me`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Work[]) => res), 
        retry(3)
      );
  }

  /** GET one of Work **/
  work(id): Observable<Work> {
    const url = `${this.httpUrlBase}/works/${id}`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Work) => res), 
        retry(3)
      );
  }

  /** POST create new Work **/
  postWorks(data: Work): Observable<Work> {
    const url = `${this.httpUrlBase}/works`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST create new Work **/
  postMyWorks(data: Work): Observable<Work> {
    const url = `${this.httpUrlBase}/works/me`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update Work **/
  updateWorks(id, data: Work): Observable<Work> {
    const url = `${this.httpUrlBase}/works/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Work **/
  deleteWorks(id): Observable<Work> {
    const url = `${this.httpUrlBase}/works/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }

}