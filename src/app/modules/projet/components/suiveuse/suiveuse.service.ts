import { Injectable } from '@angular/core';
import { Router, NavigationStart, RoutesRecognized, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { PersonRepository } from '../../repository/person.repository';
import { Personne } from '../../repository/salarie.repository';
import { SuiveuseRepository } from '../../repository/suiveuse.repository';
import { Work } from '../../repository/works.repository';

@Injectable()
export class SuiveuseService {

  /* Date selectionnée sur le calendrier */
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());

  _displayMonth: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());
  set displayMonth(value: any) { this._displayMonth.next(value); }
  get displayMonth() { return this._displayMonth; }
  get displayMonthValue() { return this._displayMonth.getValue(); }

  workByDay: {date: Date, time: number}[] = [];
  loading: boolean = false;

  constructor(
  	private suiveuseR: SuiveuseRepository,
  ) { 
  	this.setObservables();
  }

  addWorkToDay(work) {
    const idx = this.workByDay.findIndex(e => moment(e.date).isSame(moment(work.dateTravail), 'day'));
    if (idx !== -1) {
      let day = this.workByDay[idx];
      day.time += work.temps;
      this.workByDay[idx] = day;
    } else {
      this.workByDay.push({date: moment(work.dateTravail).toDate(), time: work.temps});
    }
  }

  setObservables() {
  	this.displayMonth.asObservable()
  		.pipe(
  			distinctUntilChanged((prev, curr) => moment(prev).isSame(curr, 'month')),
  			map(date => {
  				return [moment(date).startOf('month').startOf('week').format('YYYY-MM-DD'), moment(date).endOf('month').endOf('week').format('YYYY-MM-DD')]
  			}),
  			switchMap(([firstDate, lastDate]) => this.getSynthese({startAt: firstDate, endAt: lastDate})),
        tap(() => this.workByDay = []),
        map((res: any): Work[] => res["hydra:member"]),
        map((works: Work[]) => {
        	let dates: {date: Date, time: number}[] = [];
        	works.forEach(w => {
        		if (dates.findIndex(d => moment(d.date).isSame(moment(w.dateTravail), 'day')) === -1) {
        			dates.push({date: moment(w.dateTravail).toDate(), time: 0});
        		}
        		const date = dates.find(d => moment(d.date).isSame(moment(w.dateTravail), 'day'));
        		date.time += w.temps;
        	})
        	return dates;
        })
  		)
  		.subscribe(val => this.workByDay = val);
  }

  getSynthese(params): Observable<Work[]> {
    this.loading = true;
    return this.suiveuseR.getMySynthese(params)
      .pipe(
        tap(() => this.loading = false)
      );
  }  
}