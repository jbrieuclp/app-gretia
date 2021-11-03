import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

import { ProjectsRepository } from '../../../../repository/projects.repository';
import { StudyFunding } from '../../../../repository/project.interface';
import { ProjectService } from '../project.service';


@Injectable()
export class ProjectStudiesFundingsService {

  public studiesFundings: StudyFunding[] = [];
  public loading: boolean = false; //chargement du study
  public totalItems: number = 0; //chargement du study

  constructor(
    private projectR: ProjectsRepository,
    private projectS: ProjectService,
  ) { 
  	this.setObservables();
  }

  getStudiesFundings(project_id): Observable<StudyFunding[]> {
    this.loading = true;
    return this.projectR.projectStudiesFundings(project_id)
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        }),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): StudyFunding[]=>data["hydra:member"]),
        tap((studiesFundings: StudyFunding[]) => this.studiesFundings = studiesFundings)
      )
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //recuperation des info du study à partir de l'ID de l'URL
    this.projectS.project_id.asObservable()
      .pipe(
        switchMap((id: number) => this.getStudiesFundings(id)),
      )
      .subscribe(() => {return;});
  }

}
