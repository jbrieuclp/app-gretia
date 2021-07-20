import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

import { AppConfig } from '../../../shared/app.config';
import { Travailleur } from './person.repository';
import { Personne } from './salarie.repository';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

export interface Mission {
  id?: number,
  libelle?: string,
  detail?: string,
  nbJour?: any,
  etat?: any,
  projet?: any,
  travailleurs?: any
  dateCreate?: any,
  compteCreate?: any,
  dateUpdate?: any,
  compteUpdate?: any,
  travails?: any,
  usage_jour?: number,
  usage_pc?: number,
  synthTravailleurs?: any
}

export interface MissionTravailleur {
  mission?: Mission,
  personne?: Personne,
  temps?: number
}

@Injectable()
export class MissionRepository {

	httpUrlBase: string;
  // constructeur ...
  constructor(private http: HttpClient) {
    this.httpUrlBase = AppConfig.URL_PROJET;
  }

  /** GET all mission **/
  missions(limit?: number): Observable<Mission[]> {
  	const url = `${this.httpUrlBase}/missions`;
  	const options = {};
    return this.http
    	.get(url, options)
    	.pipe(
        map((res: Mission[]) => { 
          return res;
        })
        , retry(3)
	   	);
  }

  /** GET all mission **/
  getProjetMissions(projet_id: number): Observable<Mission[]> {
    const url = `${this.httpUrlBase}/projet/${projet_id}/missions`;
    const options = {};
    return this.http
      .get(url, options)
      .pipe(
        map((res: Mission[]) => { 
          return res;
        })
        , retry(3)
       );
  }

  /** GET mission par ID  **/
  getMission(mission_id: number): Observable<Mission> {
    const url = `${this.httpUrlBase}/mission/${mission_id}`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((res: Mission) => res)
        , retry(3)
       );
  }

  /** POST mission par ID  **/
  postMission(projet_id: number, data: any): Observable<Mission> {
    const url = `${this.httpUrlBase}/projet/${projet_id}/missions`;
    const options = JSON.stringify(data);
    return this.http
      .post(url, options, httpOptions)
      .pipe(
        map((mission: Mission) => mission)
       );
  }

  /** PUT mission par ID  **/
  putMission(mission: Mission, data: any): Observable<Mission> {
    const url = `${this.httpUrlBase}/mission/${mission.id}`;
    const options = JSON.stringify(data);
    return this.http
      .put(url, options, httpOptions)
      .pipe(
        map((mission: Mission) => mission)
       );
  }

  /** DELETE mission par ID **/
  delete(projet: Mission): Observable<Boolean> {
    const url = `${this.httpUrlBase}/mission/${projet.id}`;
    const options = {};
    return this.http
      .delete(url, options)
      .pipe( 
        map((res: Boolean) => { 
          return res;
        })
        , retry(3)/*, catchError(this.handleError('deleteHero'))*/ );
  }


  /** GET travailleurs par ID  **/
  getTravailleurs(mission_id: number): Observable<MissionTravailleur[]> {
    const url = `${this.httpUrlBase}/mission/${mission_id}/travailleurs`;
    return this.http
      .get(url, httpOptions)
      .pipe(
        map((travailleurs: MissionTravailleur[]) => travailleurs)
        , retry(3)
       );
  }

  /** POST travailleur par ID  **/
  postTravailleurs(mission_id: number, data: any): Observable<MissionTravailleur[]> {
    const url = `${this.httpUrlBase}/mission/${mission_id}/travailleurs`;
    const options = JSON.stringify(data);
    return this.http
      .post(url, options, httpOptions)
      .pipe(
        map((travailleurs: MissionTravailleur[]) => travailleurs)
        , retry(3)
       );
  }

  /** PUT travailleur par ID  **/
  putTravailleur(mission_id: number, trav_init_id: number, data: any): Observable<MissionTravailleur[]> {
    const url = `${this.httpUrlBase}/mission/${mission_id}/travailleur/${trav_init_id}`;
    const options = JSON.stringify(data);
    return this.http
      .put(url, options, httpOptions)
      .pipe(
        map((travailleurs: MissionTravailleur[]) => travailleurs)
        , retry(3)
       );
  }

  /** PUT travailleur par ID  **/
  removeTravailleur(mission: Mission, travailleur: MissionTravailleur): Observable<MissionTravailleur[]> {
    const url = `${this.httpUrlBase}/mission/${mission.id}/travailleur/${travailleur.personne.id}`;
    return this.http
      .delete(url, httpOptions)
      .pipe(
        map((travailleurs: MissionTravailleur[]) => travailleurs)
        , retry(3)
       );
  }

}