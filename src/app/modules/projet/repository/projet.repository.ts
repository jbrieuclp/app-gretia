import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { Salarie } from './salarie.repository';
import { Task } from './task.repository';
import { ChargeType } from './charge-type.repository';
import { ProjectType } from './project-type.repository';
import { Convention, ProjectFunding } from './conventions.repository';

export interface Projet {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "code"?: string;
  "intitule"?: string;
  "objectif"?: string;
  "dateDebut"?: string;
  "dateFin"?: string;
  "groupeTaxo"?: string;
  "milieu"?: string;
  "projectType"?: any;
  "localisations"?: any[];
  "localAttachement"?: any;
  "responsables"?: any[];
  "tasks"?: Task[];
  "fundings"?: ProjectFunding[];
  "parent"?: Projet;
  "charges"?: Charge[];
  "childrens"?: Projet[];
  "type"?: string;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface Organisme {
  id?: number,
  
}

export interface Localisation {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "nom"?: string;
  "projets"?: Projet[];
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}

export interface Charge {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: string;
  "description"?: string;
  "unitCostApplied"?: number;
  "quantity"?: number;
  "quantityUsed"?: number;
  "project"?: Projet;
  "chargeType"?: ChargeType;
  "tasks"?: ChargeType;
  "createdAt"?: Date;
  "createdBy"?: any;
  "updatedAt"?: Date;
  "updatedBy"?: any;
}


@Injectable()
export class ProjetRepository extends ApiProjectRepository {


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
  projets(params = {}): Observable<Projet[]> {
    const url = `${this.httpUrlBase}/projets`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Projet[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  projects_progression(params = {}): Observable<Projet[]> {
    const url = `${this.httpUrlBase}/projets/progression`;
    const options = {params: params};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Projet[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  projets_select(): Observable<Projet[]> {
    const url = `${this.httpUrlBase}/projets/select`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Projet[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  myProjets(): Observable<Projet[]> {
    const url = `${this.httpUrlBase}/projets/me`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Projet[]) => res), 
        retry(3)
      );
  }

  /** GET list of Localisation **/
  projet(id): Observable<Projet> {
    const url = `${this.httpUrlBase}/projets/${id}`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Projet) => res), 
        retry(3)
      );
  }

  /** POST create new Project **/
  createProjet(data: Projet): Observable<Projet> {
    const url = `${this.httpUrlBase}/projets`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** GET list of Task **/
  tasksProject(id): Observable<Task[]> {
    const url = `${this.httpUrlBase}/projets/${id}/tasks`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Task[]) => res), 
        retry(3)
      );
  }

  //////////////
  //  Charge  //
  //////////////
  /** GET list of charge **/
  chargesProject(id): Observable<Charge[]> {
    const url = `${this.httpUrlBase}/projets/${id}/charges`;
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
  fundings(id): Observable<ProjectFunding[]> {
    const url = `${this.httpUrlBase}/projets/${id}/fundings`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: ProjectFunding[]) => res), 
        retry(3)
      );
  }

  ////////////////
  //  Fundings  //
  ////////////////
  /** GET list of charge **/
  project_localisations(id): Observable<Localisation[]> {
    const url = `${this.httpUrlBase}/projets/${id}/localisations`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Localisation[]) => res), 
        retry(3)
      );
  }

  /** GET list of charge **/
  project_responsables(id): Observable<Salarie[]> {
    const url = `${this.httpUrlBase}/projets/${id}/responsables`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Salarie[]) => res), 
        retry(3)
      );
  }
}