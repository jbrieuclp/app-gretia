import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { ProjectsRepository } from '../repository/projects.repository';
import { StudiesRepository } from '../repository/studies.repository';
import { Project, Study } from '../repository/project.interface';

@Injectable()
export class GlobalProjectService {

  /* Projects */
  projects: BehaviorSubject<Project[]> = new BehaviorSubject(null);
  totalProjectItems: number = 0;
  totalStudiesItems: number = 0;

  loadingList: boolean = false;

  constructor(
  	private projectsR: ProjectsRepository,
    private studiesR: StudiesRepository,
  ) { 
    forkJoin(
      this.getProjects(),
      this.getStudies(),
    )
      .pipe(
        tap(() => this.loadingList = false),
        map(([projects, studies]: [Project[], Study[]]): Project[] => {
          return projects.map(
              project => {
                project.studiesFundings = studies.filter(
                      study => study.fundings.map(f => f.project)
                                             .includes(project['@id']) 
                );
              return project;
            }
          )
        }),
        tap((data) => console.log(data)),
      )
      .subscribe((projects: any) => this.projects.next(projects));

  	this.setObservables();
  }

  private setObservables() {
    
  }

  getProjects(): Observable<Project[]> {
    this.loadingList = true;
    return this.projectsR.projects()
      .pipe(
        tap((data: any) => this.totalProjectItems = data["hydra:totalItems"]),
        map((data: any): Project[] => data["hydra:member"]),
      )
  }

  getStudies(): Observable<Study[]> {
    this.loadingList = true;
    return this.studiesR.studies()
      .pipe(
        tap((data: any)=>this.totalStudiesItems = data["hydra:totalItems"]),
        map((data: any): Study[]=>data["hydra:member"])
      )
  }

}
