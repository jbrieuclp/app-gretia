import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of, Observable } from 'rxjs';
import { switchMap, filter, mergeMap, tap, map, skip, distinctUntilChanged } from 'rxjs/operators';

import { Action, ActionAttribution, Week } from '../../../../../repository/project.interface';
import { ActionsRepository } from '../../../../../repository/actions.repository';

@Injectable()
export class ActionService {

  action: BehaviorSubject<Action> = new BehaviorSubject(null);

  displayActionForm: boolean = false;

  loading = false;

  constructor(
    private actionR: ActionsRepository,
  ) {
    this.setObservables();
  }

  setObservables() {

    this.action.asObservable()
      .pipe(
        distinctUntilChanged(),
        filter((action) => action !== null),
        switchMap(action => 
          forkJoin(
            of(action),
            this.getAttributions(action.id),
            this.getPeriods(action.id)
          )
        ),
        map(([action, attributions, periods]): Action => Object.assign(action, {attributions: attributions, periods: periods})),
      )
      .subscribe(() => this.loading = false);
  }

  getAttributions(id): Observable<ActionAttribution[]> {
    this.loading = true;
    return this.actionR.attributions(id)
      .pipe(
        map((data: any): ActionAttribution[]=>data["hydra:member"])
      );
  }

  getPeriods(id): Observable<Week[]> {
    this.loading = true;
    return this.actionR.periods(id)
      .pipe(
        map((data: any): Week[]=>data["hydra:member"]),
        // tap((periods: Week[]) => {
        //   periods.forEach(p => {
        //     this._years[Math.abs(moment().diff(moment([p.year]), 'year'))] = p.year;
        //   })
        //   this._years = this._years.filter(v => v !== undefined);
        // }),
      );
  }
}
