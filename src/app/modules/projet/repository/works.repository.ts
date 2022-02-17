import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Action, Employee, Work, WorkCategory, Travel, Expense, Recup, Holiday } from './project.interface';


@Injectable()
export class WorksRepository extends ApiProjectRepository {

  ////////////////////
  //  CONVENTIONS  //
  ////////////////////
  /** GET list of Work **/
  works(params = {}): Observable<Work[]> {
    const url = `${this.httpUrlBase}/works`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
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

  /** GET list of ActionAttribution **/
  workCategories(params = {}): Observable<WorkCategory[]> {
    const url = `${this.httpUrlBase}/work-categories`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: WorkCategory[]) => res), 
        retry(3)
      );
  }

  /** GET list of Work **/
  myTravels(params = {}): Observable<Travel[]> {
    const url = `${this.httpUrlBase}/travels/me`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Travel[]) => res), 
        retry(3)
      );
  }

  /** POST create new Travel **/
  postMyTravels(data: Travel): Observable<Travel> {
    const url = `${this.httpUrlBase}/travels/me`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST create new Expense **/
  postMyExpenses(data: any, params: any): Observable<any> {
    const url = `${this.httpUrlBase}/expenses/me?subfolder=${params.subfolder}&sid=${params.sid}`;
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

    /** POST create new Holiday **/
  postMyHolidays(data: Holiday): Observable<Holiday> {
    const url = `${this.httpUrlBase}/holidays/me`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  expenses(params: any = {}): Observable<Expense[]> {
    const url = `${this.httpUrlBase}/expenses`;
    // const url = `${this.httpUrlBase}/expenses?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: Expense[]) => res),
        retry(3)
       );
  }

  travels(params: any = {}): Observable<Travel[]> {
    const url = `${this.httpUrlBase}/travel`;
    // const url = `${this.httpUrlBase}/expenses?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: Travel[]) => res),
        retry(3)
       );
  }

  recups(params: any = {}): Observable<Recup[]> {
    const url = `${this.httpUrlBase}/recups`;
    // const url = `${this.httpUrlBase}/expenses?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: Recup[]) => res),
        retry(3)
       );
  }

  holidays(params: any = {}): Observable<Holiday[]> {
    const url = `${this.httpUrlBase}/holidays`;
    // const url = `${this.httpUrlBase}/expenses?${params}`;
    const http_options = Object.assign({}, HTTP_OPTIONS, {params: params});
    return this.http
      .get(url, http_options)
      .pipe(
        map((res: Holiday[]) => res),
        retry(3)
       );
  }

}