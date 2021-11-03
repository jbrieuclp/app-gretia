import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { FundingTypeRef, FundingType } from './project.interface';

@Injectable()
export class FundingTypeRepository extends ApiProjectRepository {


  ///////////////////////
  //  TYPE PROJET REF  //
  ///////////////////////
  /** GET list of FundingTypeRef **/
  fundingTypeRefs(params = {}): Observable<FundingTypeRef[]> {
    const url = `${this.httpUrlBase}/funding-type-refs`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: FundingTypeRef[]) => res), 
        retry(3)
      );
  }

  /** GET list of FundingTypeRef **/
  fundingTypeRef(id): Observable<FundingTypeRef> {
    const url = `${this.httpUrlBase}/funding-type-refs/${id}`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: FundingTypeRef) => res), 
        retry(3)
      );
  }

  /** POST create new FundingTypeRef **/
  createFundingTypeRef(data: FundingTypeRef): Observable<FundingTypeRef> {
    const url = `${this.httpUrlBase}/funding-type-refs`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }
  

  ///////////////////////
  //  TYPE PROJET  //
  ///////////////////////
  /** GET list of FundingType **/
  fundingTypes(params): Observable<FundingType[]> {
    const url = `${this.httpUrlBase}/funding-types`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: FundingType[]) => res), 
        retry(3)
      );
  }

  /** POST add Salarie to Personne **/
  createFundingType(data: FundingType): Observable<FundingTypeRef> {
    const url = `${this.httpUrlBase}/funding-types`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }
  
}