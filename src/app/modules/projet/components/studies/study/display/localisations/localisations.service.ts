import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError, map, filter } from 'rxjs/operators';

import { StudiesRepository } from '../../../../../repository/studies.repository';
import { Localisation, Study } from '../../../../../repository/project.interface';
import { StudyService } from '../../study.service';


@Injectable()
export class StudyLocalisationsService {

  public localisations: Localisation[] = [];
  public loading: boolean = false; //chargement du study
  public totalItems: number = 0; //chargement du study

  constructor(
    private studyR: StudiesRepository,
    private studyS: StudyService,
  ) { 
  	this.setObservables();
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //recuperation des info du study à partir de l'ID de l'URL
    this.studyS.study.asObservable()
      .pipe(
        filter((study: Study) => study !== null),
        switchMap((study: Study) => this.getLocalisations(study.id)),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Localisation[]=>data["hydra:member"]),
      )
      .subscribe((localisations: Localisation[]) => this.localisations = localisations);
  }

  getLocalisations(study_id): Observable<Localisation[]> {
    this.loading = true;
    return this.studyR.study_localisations(study_id)
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }


}