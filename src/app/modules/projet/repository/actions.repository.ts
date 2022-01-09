import { Injectable } from '@angular/core';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Study, Employee, Action, ActionAttribution, Week, Objective } from './project.interface';

@Injectable()
export class ActionsRepository extends ApiProjectRepository {

  ////////////
  //  TASK  //
  ////////////
  /** GET list of Localisation **/
  actions_select(params = {}): Observable<Action[]> {
    const url = `${this.httpUrlBase}/actions/select`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Action[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  actions_me_for_select(params = {}): Observable<Action[]> {
    const url = `${this.httpUrlBase}/actions/me/select`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Action[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  actions_me(params = {}): Observable<Action[]> {
    const url = `${this.httpUrlBase}/actions/me`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Action[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  actions(params = {}): Observable<Action[]> {
    const url = `${this.httpUrlBase}/actions`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Action[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  action(id, params = {}): Observable<Action> {
    const url = `${this.httpUrlBase}/actions/${id}`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Action) => res), 
        retry(3)
      );
  }

  /** POST create new Action **/
  createAction(data: Action): Observable<Action> {
    const url = `${this.httpUrlBase}/actions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST create new Action **/
  createObjective(data: Objective): Observable<Objective> {
    const url = `${this.httpUrlBase}/objectives`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }


  /////////////
  //  ATTRIBUTION  //
  /////////////
  /** GET list of ActionAttribution **/
  attributions(action_id: number, params = {}): Observable<ActionAttribution[]> {
    const url = `${this.httpUrlBase}/actions/${action_id}/attributions`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ActionAttribution[]) => res), 
        retry(3)
      );
  }

  /** POST create new Action **/
  addAttribution(data: ActionAttribution): Observable<ActionAttribution> {
    const url = `${this.httpUrlBase}/action-attributions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }


  //////////////
  //  PERIOD  //
  //////////////
  /** GET list of Week **/
  periods(action_id: number, params = {}): Observable<Week[]> {
    const url = `${this.httpUrlBase}/actions/${action_id}/periods`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Week[]) => res), 
        retry(3)
      );
  }

  /** POST create new Week **/
  addPeriod(data: ActionAttribution): Observable<ActionAttribution> {
    const url = `${this.httpUrlBase}/tache-attributions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }


  weeks(params = {}): Observable<Week[]> {
    const url = `${this.httpUrlBase}/ref-weeks`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Week[]) => res), 
        retry(3)
      );
  } 
}