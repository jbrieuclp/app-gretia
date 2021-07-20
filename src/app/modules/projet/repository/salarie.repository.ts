import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { HTTP_OPTIONS, ApiProjectRepository } from './api-project.repository';
import { AppConfig } from '../../../shared/app.config';

export interface Antenne {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "nom"?: string;
  "salaries"?: Salarie[]|number[];
}

export interface Fonction {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "label"?: string;
  "salaries"?: Salarie[]|number[];
}

export interface Personne {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "nom"?: string;
  "prenom"?: string;
  "alias"?: string;
  "compteId"?: number;
  "recup"?: number;
  "salaries"?: Salarie[]|number[];
  "workIn"?: Salarie|number;
}

export interface Salarie {
  "@id"?: string;
  "@type"?: string;
  "id"?: number;
  "personne"?: Personne|any;
  "fonction"?: Fonction|number;
  "antenne"?: Antenne|number;
  "dateDebut"?: string;
  "dateFin"?: string;
  "taux"?: number;
  "removable"?: boolean;
}

@Injectable()
export class SalarieRepository extends ApiProjectRepository {

  ///////////////
  //  ANTENNE  //
  ///////////////
  /** GET list of Antenne **/
  antennes(): Observable<Antenne[]> {
    const url = `${this.httpUrlBase}/antennes`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Antenne[]) => res), 
        retry(3)
      );
  }

  /** POST create new Antenne **/
  createAntenne(data: Antenne): Observable<Antenne> {
    const url = `${this.httpUrlBase}/antennes`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update Antenne **/
  updateAntenne(id, data: Antenne): Observable<Antenne> {
    const url = `${this.httpUrlBase}/antennes/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Antenne **/
  deleteAntenne(id): Observable<Antenne> {
    const url = `${this.httpUrlBase}/antennes/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }
  
  ////////////////
  //  FONCTION  //
  ////////////////
  /** GET list of Fonction **/
  fonctions(): Observable<Fonction[]> {
    const url = `${this.httpUrlBase}/employe_fonctions`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Fonction[]) => res), 
        retry(3)
      );
  }

  /** POST create new Fonction **/
  createFonction(data: Fonction): Observable<Fonction> {
    const url = `${this.httpUrlBase}/employe_fonctions`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update Fonction **/
  updateFonction(id, data: Fonction): Observable<Fonction> {
    const url = `${this.httpUrlBase}/employe_fonctions/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Fonction **/
  deleteFonction(id): Observable<Fonction> {
    const url = `${this.httpUrlBase}/employe_fonctions/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }

  ////////////////
  //  PERSONNE  //
  ////////////////
  /** GET list of Personne **/
  personnes(): Observable<Personne[]> {
    const url = `${this.httpUrlBase}/personnes`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Personne[]) => res), 
        retry(3)
      );
  }

  /** GET list of Personne **/
  salaries(): Observable<Salarie[]> {
    const url = `${this.httpUrlBase}/salaries`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Salarie[]) => res), 
        retry(3)
      );
  }

  /** POST create new Personne **/
  createPersonne(data: Personne): Observable<Personne> {
    const url = `${this.httpUrlBase}/personnes`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST update Personne **/
  updatePersonne(id, data: Personne): Observable<Personne> {
    const url = `${this.httpUrlBase}/personnes/${id}`;
    const sources = JSON.stringify(data);
    return this.http.patch(url, sources, HTTP_OPTIONS);
  }

  /** DELETE delete Personne **/
  deletePersonne(id): Observable<Personne> {
    const url = `${this.httpUrlBase}/personnes/${id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }

  /** POST create new Personne **/
  createSalarie(data: Salarie): Observable<Salarie> {
    const url = `${this.httpUrlBase}/salaries`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** POST add Salarie to Personne **/
  addContrat(data: Salarie): Observable<Personne> {
    const personne_id = Number.isInteger(data.personne) ? (data.personne as number) : (data.personne as Personne).id;
    const url = `${this.httpUrlBase}/personnes/${personne_id}/contrat`;
    const sources = JSON.stringify(data);
    return this.http.post(url, sources, HTTP_OPTIONS);
  }

  /** DELETE remove Salarie to Personne **/
  removeContrat(personne: Personne, salarie: Salarie): Observable<Personne> {
    const url = `${this.httpUrlBase}/personnes/${personne.id}/contrat/${salarie.id}`;
    return this.http.delete(url, HTTP_OPTIONS);
  }
  
}