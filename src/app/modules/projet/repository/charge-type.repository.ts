import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { ChargeTypeRef, ChargeType } from './project.interface';


@Injectable()
export class ChargeTypeRepository extends ApiProjectRepository {

  ///////////////////////
  //  TYPE PROJET REF  //
  ///////////////////////
  /** GET list of ChargeTypeRef **/
  chargeTypeRefs(params = {}): Observable<ChargeTypeRef[]> {
    const url = `${this.httpUrlBase}/charge-type-refs`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ChargeTypeRef[]) => res), 
        retry(3)
      );
  }

  /** GET uniq of ChargeTypeRef **/
  chargeTypeRef(id): Observable<ChargeTypeRef> {
    const url = `${this.httpUrlBase}/charge-type-refs/${id}`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ChargeTypeRef) => res), 
        retry(3)
      );
  }

  /** POST create new ChargeTypeRef **/
  createChargeTypeRef(data: ChargeTypeRef): Observable<ChargeTypeRef> {
    const url = `${this.httpUrlBase}/charge-type-refs`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update ChargeTypeRef **/
  updateChargeTypeRef(id, data: ChargeTypeRef): Observable<ChargeTypeRef> {
    const url = `${this.httpUrlBase}/charge-type-refs/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete ChargeTypeRef **/
  deleteChargeTypeRef(id): Observable<ChargeTypeRef> {
    const url = `${this.httpUrlBase}/charge-type-refs/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }

  ///////////////////////
  //  TYPE PROJET  //
  ///////////////////////
  /** GET list of ChargeType **/
  chargeTypes(params): Observable<ChargeType[]> {
    const url = `${this.httpUrlBase}/charge-types`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ChargeType[]) => res), 
        retry(3)
      );
  }

  /** GET uniq of ChargeType **/
  chargeType(id): Observable<ChargeType> {
    const url = `${this.httpUrlBase}/charge-types/${id}`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ChargeType) => res), 
        retry(3)
      );
  }

  /** POST add Salarie to Personne **/
  createChargeType(data: ChargeType): Observable<ChargeTypeRef> {
    const url = `${this.httpUrlBase}/charge-types`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** DELETE remove Salarie to Personne **/
  deleteChargeType(id): Observable<ChargeTypeRef> {
    const url = `${this.httpUrlBase}/charge-types/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }
  
}