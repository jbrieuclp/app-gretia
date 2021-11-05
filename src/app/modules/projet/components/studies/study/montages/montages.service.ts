import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

import { StudiesRepository } from '../../../../repository/studies.repository';
import { Charge } from '../../../../repository/project.interface';
import { StudyService } from '../study.service';


@Injectable()
export class StudyMontagesService {

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

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //recuperation des info du study à partir de l'ID de l'URL
    this.studyS.study_id.asObservable()
      .pipe(
        switchMap((id: number) => this.getCharges(id))
      )
      .subscribe((charges: Charge[]) => this.charges.next(charges));
  }

}