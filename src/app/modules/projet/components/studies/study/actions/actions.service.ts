import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

import { StudiesRepository } from '../../../../repository/studies.repository';
import { Action, Charge } from '../../../../repository/project.interface';
import { StudyService } from '../study.service';


@Injectable()
export class StudyActionsService {

  public actions: BehaviorSubject<Action[]> = new BehaviorSubject([]);
  public loading: boolean = false; //chargement du study

  constructor(
    private studyR: StudiesRepository,
    private studyS: StudyService,
  ) { 
  	this.setObservables();
  }

  getActions(study_id): Observable<Action[]> {
    this.loading = true;
    return this.studyR.study_actions(study_id)
      .pipe(
        tap(() => this.loading = false),
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

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //recuperation des info du study à partir de l'ID de l'URL
    this.studyS.study_id.asObservable()
      .pipe(
        switchMap((id: number) => this.getActions(id))
      )
      .subscribe((actions: Action[]) => this.actions.next(actions));
  }

}
