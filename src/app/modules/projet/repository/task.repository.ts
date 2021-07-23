import { Injectable } from '@angular/core';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Projet } from './projet.repository';
import { Salarie } from './salarie.repository';

export interface Task {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "projet"?: Projet;
  "charge"?: any;
  "avancement"?: Avancement;
  "intitule"?: string;
  "objectif"?: string;
  "nbJours"?: number;
  "numberDaysDone"?: number;
  "periods"?: any[];
  "attributions"?: TaskAttribution[];
  "travaux"?: string;
  "works"?: any[];
}

export interface Action {
  id?: number;
  libelle?: string;
  description?: string;
  ordre?: number;
  taches?: Task[];
}

export interface Avancement {
  id?: number;
  libelle?: string;
  description?: string;
  ordre?: number;
  taches?: Task[];
}

export interface Week {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "year"?: number;
  "month"?: number; 
  "weekNumber"?: number; 
  "monday"?: Date;
  "sunday"?: Date;
}

export interface TaskAttribution {
  "@id"?: string;
  "@type"?: string;
  "task"?: Task|string;
  "salarie"?: Salarie;
  "nbJours"?: number;
}



@Injectable()
export class TaskRepository extends ApiProjectRepository {

  ////////////
  //  TASK  //
  ////////////
  /** GET list of Localisation **/
  tasks_select(params = {}): Observable<Task[]> {
    const url = `${this.httpUrlBase}/tasks/select`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Task[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  tasks_me(params = {}): Observable<Task[]> {
    const url = `${this.httpUrlBase}/tasks/me`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Task[]) => res), 
        retry(3)
      );
  }

  /** POST create new Task **/
  createTask(data: Task): Observable<Task> {
    const url = `${this.httpUrlBase}/taches`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Action **/
  deleteTasks(id): Observable<Object> {
    const url = `${this.httpUrlBase}/taches/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }


  /////////////
  //  ATTRIBUTION  //
  /////////////
  /** GET list of TaskAttribution **/
  attributions(task_id: number, params = {}): Observable<TaskAttribution[]> {
    const url = `${this.httpUrlBase}/taches/${task_id}/attributions`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: TaskAttribution[]) => res), 
        retry(3)
      );
  }

  /** POST create new Action **/
  addAttribution(data: TaskAttribution): Observable<TaskAttribution> {
    const url = `${this.httpUrlBase}/tache_attributions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }


  //////////////
  //  PERIOD  //
  //////////////
  /** GET list of Week **/
  periods(task_id: number, params = {}): Observable<Week[]> {
    const url = `${this.httpUrlBase}/taches/${task_id}/periods`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Week[]) => res), 
        retry(3)
      );
  }

  /** POST create new Week **/
  addPeriod(data: TaskAttribution): Observable<TaskAttribution> {
    const url = `${this.httpUrlBase}/tache_attributions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }


  weeks(params = {}): Observable<Week[]> {
    const url = `${this.httpUrlBase}/ref_weeks`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Week[]) => res), 
        retry(3)
      );
  }



  /////////////
  //  ACTON  //
  /////////////
  /** GET list of action **/
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

  /** POST create new Action **/
  createAction(data: Action): Observable<Action> {
    const url = `${this.httpUrlBase}/actions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update Action **/
  updateAction(id, data: Action): Observable<Action> {
    const url = `${this.httpUrlBase}/actions/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Action **/
  deleteAction(id): Observable<Object> {
    const url = `${this.httpUrlBase}/actions/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }
  

  //////////////////
  //  AVANCEMENT  //
  //////////////////
  /** GET list of avancement **/
  avancements(params = {}): Observable<Avancement[]> {
    const url = `${this.httpUrlBase}/etat_avancements`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Avancement[]) => res), 
        retry(3)
      );
  }

  /** POST create new Avancement **/
  createAvancement(data: Avancement): Observable<Avancement> {
    const url = `${this.httpUrlBase}/etat_avancements`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update Avancement **/
  updateAvancement(id, data: Avancement): Observable<Avancement> {
    const url = `${this.httpUrlBase}/etat_avancements/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Avancement **/
  deleteAvancement(id): Observable<Object> {
    const url = `${this.httpUrlBase}/etat_avancements/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }
}