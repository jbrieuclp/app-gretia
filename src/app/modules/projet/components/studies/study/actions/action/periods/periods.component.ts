import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, of } from 'rxjs';
import { tap, map, switchMap, skip } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { ActionsRepository } from '../../../../../../repository/actions.repository';
import { Action, Week } from '../../../../../../repository/project.interface';
import { ActionService } from '../action.service';

moment.locale('fr');

@Component({
  selector: 'app-projects-study-action-periods',
  templateUrl: './periods.component.html',
  styleUrls: ['./periods.component.scss']
})
export class ActionPeriodsComponent implements OnInit, OnDestroy {

	editionMode: boolean = false;
	periods: BehaviorSubject<Week[]> = new BehaviorSubject([]);
	_subscription: Subscription;

	get action(): Action { return this.actionS.action; };

	/**
	 *	Retourne un tableau d'années correspondant au periodes de l'action 
	 */
	get years(): number[] {
		return this.periods.getValue()
			.map((week: Week): number => week.year)
			.filter((elem, index, self) => index === self.indexOf(elem)) //dédoublonne
			.sort((a, b) => a - b);
	}


	private _viewYear: number
	get viewYear(): number {
		if (this._viewYear !== undefined) {
			return this._viewYear;
		} else {
			//si l'année actuelle est dispo dans le tableau d'année on va l'afficher en priorité
			const actualYearIdx = this.years.findIndex(year => year === moment().year());
			if (actualYearIdx !== -1) {
				return this.years[actualYearIdx];
			}
			//sinon on affiche la premiere valeur ou l'année actuel si rien du tout
			return this.years.length ? this.years[0] : moment().year();
		}
	}
	set viewYear(year) {
		this._viewYear = year;
	}

  constructor(
  	private actionR: ActionsRepository,
  	private actionS: ActionService,
  ) { }

  ngOnInit() {

  	this.periods.next(this.action.periods);

  	this._subscription = this.periods.asObservable()
  		.pipe(
  			skip(1),
  			switchMap((periods) => this.save(periods)),
  			map((periods: Week[]) => this.periods.getValue())
  		)
  		.subscribe((periods: Week[]) => this.actionS.action.periods = periods);
  }

  onChange([checked, week]: [boolean, Week]): void {
  	let _periods = this.periods.getValue();
  	if (checked) {
  		//vérification de la non présence de la semaine dans le tableau des semaines
  		if (this.action.periods.findIndex(e => e == week['@id']) === -1) {
  			_periods.push(week);
  		}
  	} else {
  		const idx = this.action.periods.findIndex(e => e == week['@id']);
  		_periods.splice(idx, 1);
  	}
  	this.periods.next(_periods);
  }

  save(periods): Observable<Week[]> {
  	return this.actionR.patch(this.action['@id'], {periods: periods.map(elem => elem['@id'])})
  						.pipe(
  							switchMap((action) => this.actionR.periods(action.id)),
  							map((data: any): Week[]=>data["hydra:member"]),
  						)
  }

  ngOnDestroy() {
  	this._subscription.unsubscribe();
  }

}
