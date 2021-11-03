import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { tap, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { ActionsRepository } from '../../../../../../repository/actions.repository';
import { Action, Week } from '../../../../../../repository/project.interface';
import { WeeksService } from './weeks.service';

@Component({
  selector: 'app-projects-study-action-weeks',
  templateUrl: './weeks.component.html',
  styleUrls: ['./weeks.component.scss']
})
export class ActionWeeksComponent implements OnInit, OnDestroy {

	@Input() displayYear: boolean = true;
	@Input() displayMonths: boolean = true;
  @Input() editionMode: boolean = false;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() changeYear: EventEmitter<number> = new EventEmitter();
  displaySelectYear: boolean = false;

  //année affichée
	private _year: BehaviorSubject<any> = new BehaviorSubject(moment().year())
	@Input() set year(year) {
		this._year.next(year);
    this.changeYear.emit(year)
	};
	get year() {
		return this._year.getValue();
	};

  //actionPeriods[]
	_periods: Week[];
  @Input() set periods(values: Week[]) { this._periods = values; };
  @Input() data: {week: Week, data: any[]}[];
  get periods() {
    if (this._periods !== undefined) {
      return this._periods;
    } else if (this.data !== undefined) {
      return this.data.map(e => e.week);
    } else {
      return [];
    }
  }

	weeks: Week[] = [];
	headerMonths: any[] = [];
	loading: boolean = false;
	private _subscription: Subscription;

  constructor(
  	private actionR: ActionsRepository,
    private weeksS: WeeksService,
  ) { }

  ngOnInit() {
  	this._subscription = this._year.asObservable()
  		.pipe(
  			distinctUntilChanged(),
  			tap(() => this.headerMonths = []),
  			tap(() => this.weeks = []),
  			map((year: number): any => year !== undefined ? {'year' : year} : {}),
  			switchMap((params: any): Observable<Week[]> => this.getWeeks(params))
  		)
  		.subscribe((weeks: Week[]) => this.weeks = weeks);
  }

  private getWeeks(params): Observable<Week[]> {
  	this.loading = true;
  	return this.actionR.weeks(params)
  		.pipe(
        map((data: any): Week[] => data["hydra:member"]),
        tap((weeks: Week[]) => this.setHeaderMonths(weeks)), //formate l'entete du tableau avec le nombre de semaines attribuées au mois
        map((weeks: Week[]) => {
        	//boucle sur les semaine de l'année affichée et sur les périodes fournies pour cochée les semaines utilisée
        	for (let i = 0; i < weeks.length; i++) {
        		weeks[i]['isUse'] = false;
        		weeks[i]['label'] = moment(weeks[i].monday).format('DD/MM/YYYY') + ' - ' + moment(weeks[i].sunday).format('DD/MM/YYYY');
        		this.periods.forEach(p => {
        			if (p.year == weeks[i].year && p.weekNumber == weeks[i].weekNumber) {
		        		weeks[i]['isUse'] = true;
		        		return;
        			}
        		});
        	}
        	return weeks;
        }),
        tap(() => this.loading = false)
      );
  }

  upYear()  {
  	this.year = Number(this.year) + 1;
  }

  downYear()  {
  	this.year = Number(this.year) - 1;
  }

  changeEvent(event, week) {
    this.change.emit([event.checked, week]);
  }

  getSelectYear() {
    let year = [];
    for (let i = 1970; i <= moment().year() + 3; i++) {
      year.push(i);
    }
    return year.reverse();
  }

  private setHeaderMonths(weeks): void {
		weeks.forEach((w) => {
			if (this.headerMonths[moment([w.year, w.month-1]).month()] === undefined) {
				this.headerMonths[moment([w.year, w.month-1]).month()] = {
					label: moment([w.year, w.month-1]).format('MMMM'),
					weeks: 1
				};
			} else {
				this.headerMonths[moment([w.year, w.month-1]).month()].weeks = this.headerMonths[moment([w.year, w.month-1]).month()].weeks + 1
			}
		});
	}

  mouseEnter(event, week) {
    this.weeksS.week.next(week);
  }
  mouseLeave(event) {
    this.weeksS.week.next(null);
  }

	ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
