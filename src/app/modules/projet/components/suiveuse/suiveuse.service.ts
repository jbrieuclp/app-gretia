import { Injectable } from '@angular/core';
import { Router, NavigationStart, RoutesRecognized, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { PersonRepository } from '../../repository/person.repository';
import { SuiveuseRepository } from '../../repository/suiveuse.repository';
import { Work, Recup } from '../../repository/project.interface';

class DateWorkTime {
  date: Date; 
  work_day: number = 0;
  work_night: number = 0;
  work_we: number = 0;
  travel: number = 0;
  recup: number = 0;

  coeff_night: number = 1;
  coeff_travel: number = 1;
  coeff_we: number = 1;

  constructor(date: Date) {
    this.date = date;
  }

  addWork(work: Work) {
    if (work.isWe) {
      this.work_we += work.duration;
    } else {
      if (work.isNight) {
        this.work_night += work.duration;
      } else {
        this.work_day += work.duration;
      }
    }

    this.travel += work.travels.map(t => t.duration).reduce((a, b) => a + b, 0);
  }

  addCoeff(coeff: any) {
    if (coeff.code === 'WEEKEND_HOURS_COEFF') {
      this.coeff_we = +coeff.value;
    } 

    if (coeff.code === 'NIGHT_HOUR_COEFF') {
      this.coeff_night = +coeff.value;
    }

    if (coeff.code === 'TRAVEL_HOUR_COEFF') {
      this.coeff_travel = +coeff.value;
    }
  }

  addRecup(recup: Recup) {
    this.recup += +recup.quantity;
  }

  addTravel(time) {
    this.travel += time;
  }

  get workingTime() {
    return this.work_day + (this.work_night * this.coeff_night) + (this.travel * this.coeff_travel);
  }

};

@Injectable()
export class SuiveuseService {

  /* Date selectionnée sur le calendrier */
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());

  _displayMonth: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());
  set displayMonth(value: any) { this._displayMonth.next(value); }
  get displayMonth() { return this._displayMonth; }
  get displayMonthValue() { return this._displayMonth.getValue(); }

  workByDay: DateWorkTime[] = [];
  loading: boolean = false;

  constructor(
  	private suiveuseR: SuiveuseRepository,
  ) { 
  	this.setObservables();
  }

  setObservables() {
  	this.displayMonth.asObservable()
  		.pipe(
  			distinctUntilChanged((prev, curr) => moment(prev).isSame(curr, 'month')),
  			map(date => {
  				return [moment(date).startOf('month').startOf('week').format('YYYY-MM-DD'), moment(date).endOf('month').endOf('week').format('YYYY-MM-DD')]
  			}),
  			switchMap(([firstDate, lastDate]): Observable<DateWorkTime[]> => this.getDataByPeriod(firstDate, lastDate)),
        tap(() => this.workByDay = []),
  		)
  		.subscribe((val: DateWorkTime[]) => this.workByDay = val);
  }

  getDataByPeriod(start, end, loader: boolean = true): Observable<any> {
    return forkJoin(
      this.getSynthese({startAt: moment(start).format('YYYY-MM-DD'), endAt: moment(end).format('YYYY-MM-DD')}, loader),
      this.getRecup({startAt: moment(start).format('YYYY-MM-DD'), endAt: moment(end).format('YYYY-MM-DD')}, loader),
      this.getParameters({startAt: moment(start).format('YYYY-MM-DD'), endAt: moment(end).format('YYYY-MM-DD'), 'code[]': ['WEEKEND_HOURS_COEFF', 'NIGHT_HOUR_COEFF', 'TRAVEL_HOUR_COEFF']}, loader),
    )
      .pipe(
        map(([works, recups, coeff]: [any, any, any]): [Work[], Recup[], any[]] => [
          works["hydra:member"], 
          recups["hydra:member"],
          coeff["hydra:member"],
        ]),
        map(([works, recups, coeff]: [Work[], Recup[], any[]]): DateWorkTime[] => {
          let dates: DateWorkTime[] = [];
          works.forEach((work: Work) => {
            //si l'objet DateWorkTime correspondant à la date du Work n'existe pas on le créer
            if (dates.findIndex(d => moment(d.date).isSame(moment(work.workingDate), 'day')) === -1) {
              dates.push(new DateWorkTime(moment(work.workingDate).toDate()));
            }

            const date = dates.find(d => moment(d.date).isSame(moment(work.workingDate), 'day'));

            //lecture des coeff nuit/week-end et application à la date
            coeff.forEach(e => {
              if (moment(work.workingDate).isBetween(moment(e.contractStart), moment(e.contractEnd||undefined), undefined, '[]')) {
                date.addCoeff(e);
              }
            });

            // récupération de l'objet DateWorkTime correspondant à la date du work
            date.addWork(work);
          })

          recups.forEach((recup: Recup) => {
            //si l'objet DateWorkTime correspondant à la date de la Recup n'existe pas on le créer
            if (dates.findIndex(d => moment(d.date).isSame(moment(recup.dateRecup), 'day')) === -1) {
              dates.push(new DateWorkTime(moment(recup.dateRecup).toDate()));
            }
            // récupération de l'objet DateWorkTime correspondant à la date du work
            const date = dates.find(d => moment(d.date).isSame(moment(recup.dateRecup), 'day'));
            date.addRecup(recup);
          })

          return dates;
        })
      )
    ;
  }

  refreshDayData(day): void {
    this.getDataByPeriod(day, day, false)
      .pipe(
        map((val: DateWorkTime[]): DateWorkTime => val.shift()),
        map((val: DateWorkTime): [DateWorkTime, number] => {
          return [
            val,
            this.workByDay.findIndex(elem => moment(elem.date).format('YYYY-MM-DD') === moment(day).format('YYYY-MM-DD'))
          ]
        }),
        filter(([val, idx]: [DateWorkTime, number])  => idx !== -1),
      )
      .subscribe(([val, idx]: [DateWorkTime, number]) => this.workByDay[idx] = val)
  }

  getSynthese(params, loader: boolean): Observable<Work[]> {
    if (loader) {
      this.loading = true;
    }
    return this.suiveuseR.getMySynthese(params)
      .pipe(
        tap(() => this.loading = false)
      );
  }  

  getRecup(params, loader: boolean): Observable<Work[]> {
    if (loader) {
      this.loading = true;
    }
    return this.suiveuseR.getMyRecup(params)
      .pipe(
        tap(() => this.loading = false)
      );
  }  

  getParameters(params, loader: boolean): Observable<any[]> {
    if (loader) {
      this.loading = true;
    }
    return this.suiveuseR.getMyParameters(params)
      .pipe(
        tap(() => this.loading = false)
      );
  }  
}