import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { filter, tap, map, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
// import { dateFundingTypeValidator } from './date-project-type.validator';

import * as moment from 'moment';

import { AbstractControl } from '../abstract.control';
import { ProjectsRepository } from '../../repository/projects.repository';
import { ProjectType } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-project-type-control',
  templateUrl: './project-type-control.component.html',
  styleUrls: ['./project-type-control.component.scss']
})
export class ProjectTypeControlComponent extends AbstractControl implements OnInit, OnDestroy {

  projectTypes: ProjectType[] = [];
  loading: boolean = false;

  constructor(
  	private projectsR: ProjectsRepository
  ) { 
    super()
  }

  ngOnInit() {
    super.ngOnInit();
    
    this._subscriptions.push(
      this.getProjectTypes()
        .pipe(
          map(date => date === null ? [] : date),
          distinctUntilChanged(),
        )
        .subscribe((projectTypes: ProjectType[])=>this.projectTypes = projectTypes)
    );
  }

  private getProjectTypes(): Observable<ProjectType[]> {
    this.loading = true;
    return this.projectsR.projectTypes()
            .pipe(
              map((data: any): ProjectType[]=>data["hydra:member"]),
              tap(() => this.loading = false)
            );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
