import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';

import { ProjectsRepository } from '../../../../repository/projects.repository';
import { Project, Deadline } from '../../../../repository/project.interface';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projet-project-deadlines',
  templateUrl: './deadlines.component.html',
  styles: ['table .mat-icon-button { height: 24px; line-height: 24px; }']
})
export class DeadlinesComponent implements OnInit, OnDestroy {

	public totalItems: number = 0;
	private _deadlines: Deadline[] = [];
  set deadlines(values: Deadline[]) { this._deadlines = values; };
  get deadlines(): Deadline[] { return this._deadlines.filter(v => v !== null); };
	public loadingList: boolean = false;

  public _subscriptions: Subscription[] = [];

  constructor(
  	private projectR: ProjectsRepository,
  	private projectS: ProjectService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
    	this.projectS.project.asObservable()
    		.pipe(
    			filter((project: Project) => project !== null),
    			switchMap((project: Project): Observable<Deadline[]> => this.getDeadlines(project.id)),
    		)
    		.subscribe((deadlines: Deadline[]) => this.deadlines = deadlines)
    );
  }

  getDeadlines(project_id): Observable<Deadline[]> {
  	this.loadingList = true;
  	return this.projectR.projectDeadlines(project_id)
  		.pipe(
  			tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Deadline[] => data["hydra:member"]),
        tap(() => this.loadingList = false),
  		);
  }

  deadlineChange([id, deadline]) {
    const index = this._deadlines.findIndex(f => f['@id'] === id);
    this._deadlines[index] = deadline;
  }

  deadlineCreate(deadline) {
    this._deadlines.push(deadline);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => { s.unsubscribe(); });
  }

}
