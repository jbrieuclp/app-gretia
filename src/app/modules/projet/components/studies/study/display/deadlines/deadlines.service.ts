import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, forkJoin } from 'rxjs';
import { tap, switchMap, catchError, map, filter, distinctUntilChanged } from 'rxjs/operators';

import { StudiesRepository } from '@projet/repository/studies.repository';
import { StudyDeadline, Study } from '@projet/repository/project.interface';
import { StudyService } from '../../study.service';


@Injectable()
export class StudyDeadlinesService {

  public deadlines: BehaviorSubject<StudyDeadline[]> = new BehaviorSubject([]);
  private _loading: boolean = false; //chargement des deadlines
  get loading(): boolean { return !(!this._loading && !this.studyS.loadingStudy); }; //chargement du study

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
        distinctUntilChanged(),
        filter((study: Study) => study !== null),
        switchMap((study: Study): Observable<StudyDeadline[]> => this.getDeadlines(study.id))
      )
      .subscribe((deadlines: StudyDeadline[]) => this.deadlines.next(deadlines));
  }

  private getDeadlines(study_id): Observable<StudyDeadline[]> {
    this._loading = true;
    return this.studyR.study_deadlines(study_id)
      .pipe(
        map((data: any): StudyDeadline[]=>data["hydra:member"]),
        tap(() => this._loading = true),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }
}
