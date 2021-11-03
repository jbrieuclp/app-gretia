import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { tap, switchMap, catchError, map } from 'rxjs/operators';

import { ProjectsRepository } from '../../../../repository/projects.repository';
import { Funder } from '../../../../repository/project.interface';
import { ProjectService } from '../project.service';


@Injectable()
export class ProjectFundersService {

  public funders: Funder[] = [];
  public loading: boolean = false; //chargement du study
  public totalItems: number = 0; //chargement du study
  get total(): number { return this.funders.map(f => f.funding).reduce((a, b) => a+b, 0); }

  constructor(
    private projectR: ProjectsRepository,
    private projectS: ProjectService,
  ) { 
  	this.setObservables();
  }

  getFunders(project_id): Observable<Funder[]> {
    this.loading = true;
    return this.projectR.projectFunders(project_id)
      .pipe(
        tap(() => this.loading = false),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        }),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Funder[]=>data["hydra:member"]),
        tap((funders: Funder[]) => this.funders = funders)
      )
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //recuperation des info du study à partir de l'ID de l'URL
    this.projectS.project_id.asObservable()
      .pipe(
        switchMap((id: number) => this.getFunders(id)),
      )
      .subscribe(() => {return;});
  }

}
