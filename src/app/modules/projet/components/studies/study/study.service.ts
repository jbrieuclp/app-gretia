import { Injectable } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, Observable, throwError } from 'rxjs';
import { filter, tap, map, switchMap, skip, catchError, distinctUntilChanged } from 'rxjs/operators';

import { StudiesRepository } from '@projet/repository/studies.repository';
import { Employee, Action, Study, Charge, Project } from '@projet/repository/project.interface';

@Injectable()
export class StudyService {

	public study_id: BehaviorSubject<number> = new BehaviorSubject(null); //from URL
  public study: BehaviorSubject<Study> = new BehaviorSubject(null);
  public loadingStudy: boolean = false; //chargement de l'étude en cours
  public displayForm: boolean = false;
  public currentTab: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(
    private studiesR: StudiesRepository,
  ) { 
  	this.setObservables();
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {   

    //recuperation des info du projet à partir de l'ID de l'URL
    this.study_id//.asObservable()
      .pipe(
        filter((id) => id !== null),
        distinctUntilChanged(),
        switchMap((id: number) => this.getStudy(id)),
      )
      .subscribe((study: Study) => this.study.next(study));
  }

  getStudy(id): Observable<Study> {
    this.loadingStudy = true;
    return this.studiesR.study(id)
      .pipe(
        tap(() => this.loadingStudy = false),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }
}
