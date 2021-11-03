import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Project, StudyFunding, ChargeType, Employee, Action, Localisation, Study, Charge } from './project.interface';

@Injectable()
export class StudiesRepository extends ApiProjectRepository {


  update(id, data: any) {
    const url = `${this.url_backend}${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  ////////////////////
  //  LOCALISATION  //
  ////////////////////
  /** GET list of Localisation **/
  localisations(): Observable<Localisation[]> {
    const url = `${this.httpUrlBase}/localisations`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Localisation[]) => res), 
        retry(3)
      );
  }

  /** POST create new Localisation **/
  createLocalisation(data: Localisation): Observable<Localisation> {
    const url = `${this.httpUrlBase}/localisations`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update Localisation **/
  updateLocalisation(id, data: Localisation): Observable<Localisation> {
    const url = `${this.httpUrlBase}/localisations/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Localisation **/
  deleteLocalisation(id): Observable<Localisation> {
    const url = `${this.httpUrlBase}/localisations/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }

  //////////////
  //  PROJET  //
  //////////////
  /** GET list of Localisation **/
  studies(params = {}): Observable<Study[]> {
    const url = `${this.httpUrlBase}/studies`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Study[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  studies_progression(params = {}): Observable<Study[]> {
    const url = `${this.httpUrlBase}/studies/progression`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Study[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  studies_select(): Observable<Study[]> {
    const url = `${this.httpUrlBase}/studies/select`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Study[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  myStudies(): Observable<Study[]> {
    const url = `${this.httpUrlBase}/studies/me`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Study[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  study(id): Observable<Study> {
    const url = `${this.httpUrlBase}/studies/${id}`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Study) => res), 
        retry(3)
      );
  }

  /** POST create new Study **/
  createStudy(data: Study): Observable<Study> {
    const url = `${this.httpUrlBase}/studies`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** GET list of Action **/
  study_actions(id): Observable<Action[]> {
    const url = `${this.httpUrlBase}/studies/${id}/actions`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Action[]) => res), 
        retry(3)
      );
  }

  //////////////
  //  Charge  //
  //////////////
  /** GET list of charge **/
  chargesStudy(id): Observable<Charge[]> {
    const url = `${this.httpUrlBase}/studies/${id}/charges`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Charge[]) => res), 
        retry(3)
      );
  }

  /** POST create new Charge **/
  createCharge(data: Charge): Observable<Charge> {
    const url = `${this.httpUrlBase}/charges`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** PATCH update Charge **/
  updateCharge(id, data: Charge): Observable<Charge> {
    const url = `${this.httpUrlBase}/charges/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Localisation **/
  deleteCharge(id): Observable<Charge> {
    const url = `${this.httpUrlBase}/charges/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }

  ////////////////
  //  Fundings  //
  ////////////////
  /** GET list of charge **/
  fundings(id): Observable<StudyFunding[]> {
    const url = `${this.httpUrlBase}/studies/${id}/fundings`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: StudyFunding[]) => res), 
        retry(3)
      );
  }

  ////////////////
  //  Fundings  //
  ////////////////
  /** GET list of charge **/
  study_localisations(id): Observable<Localisation[]> {
    const url = `${this.httpUrlBase}/studies/${id}/localisations`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Localisation[]) => res), 
        retry(3)
      );
  }

  /** GET list of charge **/
  study_managers(id): Observable<Employee[]> {
    const url = `${this.httpUrlBase}/studies/${id}/managers`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Employee[]) => res), 
        retry(3)
      );
  }
}