import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { filter, tap, map, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
// import { dateProjectTypeValidator } from './date-project-type.validator';

import * as moment from 'moment';

import { ProjectTypeRepository, ProjectType } from '../../repository/project-type.repository';

@Component({
  selector: 'app-projet-control-project-type',
  templateUrl: './project-type-control.component.html',
  styleUrls: ['./project-type-control.component.scss']
})
export class ProjectTypeControlComponent implements OnInit, OnDestroy {

	@Input() form: FormControl;
  @Input() required: boolean = false;
  @Input() dateFilter: FormControl;
  @Input() appearance: string = 'legacy';
  
  projectTypes: ProjectType[] = [];
  _subscription: Subscription;
  loading: boolean = false;


  constructor(
  	private projectTypeR: ProjectTypeRepository
  ) { }

  ngOnInit() {
    this._subscription = this.dateFilter.valueChanges
      .pipe(
        startWith(null),
        map(date => date === null ? [] : date),
        debounceTime(300), 
        distinctUntilChanged(),
        switchMap((date): Observable<ProjectType[]> => this.getProjectTypes(date))
      )
      .subscribe((projectTypes: ProjectType[])=>this.projectTypes = projectTypes);;
  }

  private getProjectTypes(date): Observable<ProjectType[]> {
    this.loading = true;
    return this.projectTypeR.projectTypes({
              "applicationDebut[before]": moment(date).format('yyyy-MM-DD'),
              "applicationFin[after]": moment(date).format('yyyy-MM-DD')
            })
            .pipe(
              map((data: any): ProjectType[]=>data["hydra:member"]),
              tap(() => this.loading = false)
            );
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
