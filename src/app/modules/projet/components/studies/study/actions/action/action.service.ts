import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, of, Observable } from 'rxjs';
import { switchMap, filter, mergeMap, tap, map, skip } from 'rxjs/operators';

import { Action, ActionAttribution, Week } from '../../../../../repository/project.interface';
import { ActionsRepository } from '../../../../../repository/actions.repository';

@Injectable()
export class ActionService {

  action_id: BehaviorSubject<number> = new BehaviorSubject(null);

  action: Action = null;
  displayActionForm: boolean = false;

  loading = false;

  constructor(
    private actionR: ActionsRepository,
  ) {
    this.setObservables();
  }

  setObservables() {

    this.action_id.asObservable()
      .pipe(
        skip(1),
        switchMap(action_id => 
          forkJoin(
            this.getAction(action_id),
            this.getAttributions(action_id),
            this.getPeriods(action_id)
          )
        ),
        map(([action, attributions, periods]): Action => {
          action.attributions = attributions;
          action.periods = periods;
          return action;
        }),
        tap(action => this.action = action),
      )
      .subscribe(() => this.loading = false);
  }

  getAction(id): Observable<Action> {
    this.loading = true;
    return this.actionR.action(id)
      .pipe(
        tap((action: Action)=> console.log(action))
      );
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
