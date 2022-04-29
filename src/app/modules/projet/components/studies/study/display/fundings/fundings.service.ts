import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, switchMap, catchError, map, distinctUntilChanged, filter } from 'rxjs/operators';

import { StudiesRepository } from '@projet/repository/studies.repository';
import { StudyFunding, Study } from '@projet/repository/project.interface';
import { StudyService } from '../../study.service';


@Injectable()
export class StudyFundingsService {

  public fundings: BehaviorSubject<StudyFunding[]> = new BehaviorSubject([]);
  public loading: boolean = false; //chargement du study

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
        switchMap((study: Study): Observable<StudyFunding[]> => this.getFundings(study.id))
      )
      .subscribe((fundings: StudyFunding[]) => this.fundings.next(fundings));
  }

  private getFundings(study_id): Observable<StudyFunding[]> {
    this.loading = true;
    return this.studyR.fundings(study_id)
      .pipe(
        tap(() => this.loading = false),
        map((data: any): StudyFunding[]=>data["hydra:member"]),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }


}
