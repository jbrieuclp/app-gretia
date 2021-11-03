import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

import { StudiesRepository } from '../../../../repository/studies.repository';
import { StudyFunding } from '../../../../repository/project.interface';
import { StudyService } from '../study.service';


@Injectable()
export class StudyFinancementService {

  public fundings: StudyFunding[] = [];
  public loading: boolean = false; //chargement du study

  constructor(
    private studyR: StudiesRepository,
    private studyS: StudyService,
  ) { 
  	this.setObservables();
  }

  getFundings(study_id): Observable<StudyFunding[]> {
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

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //recuperation des info du study à partir de l'ID de l'URL
    this.studyS.study_id.asObservable()
      .pipe(
        switchMap((id: number) => this.getFundings(id))
      )
      .subscribe((fundings: StudyFunding[]) => this.fundings = fundings);
  }

}
