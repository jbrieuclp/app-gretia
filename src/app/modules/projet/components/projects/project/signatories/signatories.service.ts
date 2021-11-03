import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

import { ProjectsRepository } from '../../../../repository/projects.repository';
import { Signatory } from '../../../../repository/project.interface';
import { ProjectService } from '../project.service';

@Injectable()
export class ProjectSignatoriesService {

  public signatories: Signatory[] = [];
  public loading: boolean = false; //chargement du study
  public totalItems: number = 0; //chargement du study

  constructor(
    private projectR: ProjectsRepository,
    private projectS: ProjectService,
  ) { 
  	this.setObservables();
  }

  getSignatories(project_id): Observable<Signatory[]> {
    this.loading = true;
    return this.projectR.projectSignatories(project_id)
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        }),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Signatory[]=>data["hydra:member"]),
        tap((signatories: Signatory[]) => this.signatories = signatories)
      )
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //recuperation des info du study à partir de l'ID de l'URL
    this.projectS.project_id.asObservable()
      .pipe(
        switchMap((id: number) => this.getSignatories(id)),
      )
      .subscribe(() => {return;});
  }

}
