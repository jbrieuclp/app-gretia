import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, forkJoin } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

import { StudiesRepository } from '../../../../repository/studies.repository';
import { Action, Charge, Objective } from '../../../../repository/project.interface';
import { StudyService } from '../study.service';


@Injectable()
export class StudyActionsService {

  public actions: BehaviorSubject<Action[]> = new BehaviorSubject([]);
  public objectives: BehaviorSubject<Objective[]> = new BehaviorSubject([]);
  private _loading: boolean = false; //chargement du study
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
    this.studyS.study_id.asObservable()
      .pipe(
        tap(() => this._loading = true),
        switchMap((id: number) => {
          return forkJoin(
            this.getActions(id),
            this.getObjectives(id)
          );
        }),
        tap(() => this._loading = false),
        map(([actions, objectives]: [Action[], Objective[]]) => {
          return [actions, objectives];
        })
      )
      .subscribe(([actions, objectives]: [Action[], Objective[]]) => {
        this.actions.next(actions);
        this.objectives.next(objectives);
      });
  }

  getActions(study_id): Observable<Action[]> {
    return this.studyR.study_actions(study_id)
      .pipe(
        map((data: any): Charge[]=>data["hydra:member"]),
        tap((data: any)=>console.log(data)),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }

  getObjectives(study_id): Observable<Action[]> {
    return this.studyR.study_objetives(study_id)
      .pipe(
        map((data: any): Charge[]=>data["hydra:member"]),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }

  refresh() {
    this.getActions(this.studyS.study_id.getValue())
      .subscribe((actions: Action[]) => this.actions.next(actions));
  }


}
