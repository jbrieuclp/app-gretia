import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AuthService } from '../../../../../../../shared/auth/authentication.service';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { ActionsRepository } from '../../../../../repository/actions.repository';
import { SuiveuseRepository } from '../../../../../repository/suiveuse.repository';
import { Action, Week, LoadPlan } from '../../../../../repository/project.interface';
import { PlanChargesService } from '../../plan-charges.service';

@Component({
  selector: 'app-project-plan-schedul-editor',
  templateUrl: './schedul-editor.dialog.html',
  styleUrls: ['./schedul-editor.dialog.scss']
})
export class SchedulEditorDialog implements OnInit {

  actions: Action[] = [];
  weeks: Week[] = [];
  months: any[] = [];
  loadPlans: LoadPlan[] = [];
  get user() { return this.authService.getUser().getValue(); };
  get person() { return this.planChargesS.person.getValue(); };
  get currentYear(): number { return this.planChargesS.year.getValue(); };
  
  loading: boolean = false;
  disableInput: boolean = false;

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<SchedulEditorDialog>,
    public actionsR: ActionsRepository,
    public suiveuseR: SuiveuseRepository,
    public planChargesS: PlanChargesService
  ) { }

  ngOnInit() {
    this.getActions()
      .pipe(
        map((actions: Action[]): Action[] => actions.filter(elem => elem.periods.filter(p => p.year === this.currentYear).length > 0)),
        tap((actions: Action[]) => this.setWeeksMonths(actions)),
        tap((actions: Action[]) => this.setLoadPlans(actions))
      )
      .subscribe((actions: Action[]) => this.actions = actions)
  }

  private setWeeksMonths(actions: Action[]) {
    this.weeks = ([].concat
                          .apply([], actions.map(elem => elem.periods)))
                      .filter(elem => elem.year === this.currentYear)
                      .filter((elem, index, self) => index === self.findIndex((t) => t['@id'] === elem['@id']))
                      .sort((a, b) => a.monday > b.monday && 1 || -1);

    this.months = this.weeks.map(elem => { 
               return {
                 'year': elem.year, 
                 'month': elem.month, 
                 'label': moment([elem.year, elem.month-1]).format('MMMM')
               }; 
             })
             .filter((elem, index, self) => index === self.findIndex((t) => t.label === elem.label)) //dédoublonne
             .sort((a, b) => a.year+'-'+(a.month).toString().padStart(2, '0') > b.year+'-'+(b.month).toString().padStart(2, '0') && 1 || -1);
  }

  private setLoadPlans(actions): void {
    actions.forEach(action => this.addLoadPlan(action.loadPlans.map(elem => {elem['action'] = action['@id']; return elem})));
  }

  private addLoadPlan(loadPlan: any[] | any): void {
    if ( Array.isArray(loadPlan) ) {
      loadPlan.forEach(loadPlan => this.addLoadPlan(loadPlan));
    } else {
      const idx = this.loadPlans.findIndex(elem => elem['@id'] === loadPlan['@id']);
      if (idx !== -1) {
        //supression de la valeur existante pour remplacement
        this.loadPlans.splice(idx, 1); 
      }
      //ajout de la valeur
      this.loadPlans.push(loadPlan);
    }
  }

  getWeekNumberFromMonth(month: number) {
    return this.weeks.filter(elem => elem.month === month).length;
  }

  getActions(): Observable<Action[]> {
    this.loading = true;
    return this.actionsR.actions_me()
      .pipe(
        tap(() => this.actions = []),
        map((data: any): Action[]=>data["hydra:member"]),
        tap(() => this.loading = false),
      )
  }

  /**
   * Retourne le nombre de jours disponible pour une action
   */  
  getMyAttribution(action) {
    const attribution = action.attributions.find(elem => elem.employee.person.compteId === this.user.id);
    return attribution ? attribution.nbOfDays : 0;
  }

  /**
   * Retourne le nombre de jours indiqué dans le plan de charge pour une action
   */
  getLoadPlanDaysForAction(action) {
    return this.loadPlans.filter(elem => (elem.action['@id'] !== undefined ? elem.action['@id'] : elem.action) === action['@id'])
                                      .map(elem => elem.nbOfDays)
                                      .reduce((a, b) => a + b, 0);
  }

  isActionsWeekPeriod(action, week): boolean {
    return action.periods.findIndex(elem => elem['@id'] === week['@id']) !== -1;
  }

  getLoadPlanValue(action, week): number {
    const loadPlan = this.loadPlans.find(elem => 
      (elem.action['@id'] !== undefined ? elem.action['@id'] : elem.action) === action['@id']
      && (elem.person['@id'] !== undefined ? elem.person['@id'] : elem.person) === this.person['@id'] 
      && (elem.week['@id'] !== undefined ? elem.week['@id'] : elem.week) === week['@id']
    );
    return loadPlan !== undefined ? loadPlan.nbOfDays : null;
  }

  loadPlanSubmit(event, action, week): void {
    this.disableInput = true;
    let api;
    const url: string = `/api/project/load-plans/action=${action.id};person=${this.person.id};week=${week.id}`;
    if (this.loadPlans.findIndex(elem => elem['@id'] === url) !== -1) {
      api = this.suiveuseR.patch(url, {nbOfDays: +event.target.value});
    } else {
      const data: LoadPlan = {person: this.person['@id'], action: action['@id'], week: week['@id'], nbOfDays: +event.target.value};
      api = this.suiveuseR.postLoadPlan(data);
    }
    
    api
      .pipe(
        tap(() => this.disableInput = false)
      )
      .subscribe((loadPlan: LoadPlan) => this.addLoadPlan(loadPlan));
  }

  getWeekCumul(week): number {
    return this.loadPlans.filter(elem => (elem.week['@id'] !== undefined ? elem.week['@id'] : elem.week) === week['@id'])
                                      .map(elem => elem.nbOfDays)
                                      .reduce((a, b) => a + b, 0);
  }

  close() {
    this.dialogRef.close(false);
  }

}
