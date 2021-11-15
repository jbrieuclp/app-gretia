import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError, map, filter } from 'rxjs/operators';

import { StudiesRepository } from '../../../../../repository/studies.repository';
import { Employee, Study } from '../../../../../repository/project.interface';
import { StudyService } from '../../study.service';


@Injectable()
export class StudyManagersService {

  public managers: Employee[] = [];
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
        switchMap((study: Study) => this.getResponsables(study.id)),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Employee[]=>data["hydra:member"]),
      )
      .subscribe((managers: Employee[]) => this.managers = managers);
  }

  getResponsables(study_id): Observable<Employee[]> {
    this.loading = true;
    return this.studyR.study_managers(study_id)
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }


}
