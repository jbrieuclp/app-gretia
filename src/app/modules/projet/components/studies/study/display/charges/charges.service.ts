import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, switchMap, catchError, map, filter, distinctUntilChanged } from 'rxjs/operators';

import { StudiesRepository } from '@projet/repository/studies.repository';
import { Charge, Study } from '@projet/repository/project.interface';
import { StudyService } from '../../study.service';


@Injectable()
export class StudyChargesService {

  public charges: BehaviorSubject<Charge[]> = new BehaviorSubject([]);
  public actionsRealCost: BehaviorSubject<number> = new BehaviorSubject(0);
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
        distinctUntilChanged(),
        filter((study: Study) => study !== null),
        switchMap((study: Study): Observable<Charge[]> => this.getCharges(study.id))
      )
      .subscribe((charges: Charge[]) => this.charges.next(charges));
  }

  getCharges(study_id): Observable<Charge[]> {
    this.loading = true;
    return this.studyR.chargesStudy(study_id)
      .pipe(
        tap(() => this.loading = false),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Charge[]=>data["hydra:member"]),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }


}
