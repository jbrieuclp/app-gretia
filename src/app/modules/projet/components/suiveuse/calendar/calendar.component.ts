import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { filter, tap, switchMap, map, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../suiveuse.service';

@Component({
  selector: 'app-projet-suiveuse-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy  {

  get month(): Date { return this.suiveuseS.displayMonthValue; }
  dates: BehaviorSubject<Array<any>> = new BehaviorSubject([]);
  months: Array<string> = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  selectYears: number[] = [moment().year()];
 
  _subscriptions: Subscription[] = [];

  /* Date selectionnée sur le calendrier */
  get selectedDate() { return this.suiveuseS.selectedDate; }
  get loadingWork(): boolean { return this.suiveuseS.loading }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private suiveuseS: SuiveuseService,
  ) {}
  
  ngOnInit() {

    this.setSelectYears();

    /**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.route.queryParams
        .pipe(
          filter(params => !isNaN(Date.parse(params['date']))),
          map((params): Date => new Date(params['date'])),
          tap((date: Date) => this.suiveuseS.displayMonth.next(date))
        )
        .subscribe((date: Date) => {
          this.selectedDate.next(date);
        })
    );

    this._subscriptions.push(
      this.suiveuseS.displayMonth
        .subscribe(date=>this.initMonths())
    );

    /**
     * Observe le changement de la date selectionnée et ajuste l'URL en conséquence
     * ajoute la date en parametre GET dans l'URL
     **/
    this._subscriptions.push(
      this.selectedDate.asObservable()
        .pipe(
          filter((date: Date) => date !== null),
          distinctUntilChanged(),
          map((date: Date): string => moment(date).format('YYYY-MM-DD'))
        )
        .subscribe((date: string) => this.location.go(`${this.router.url.split('?')[0]}?date=${date}`))
    );
  }

  private setSelectYears() {
    const year = this.selectYears[0];

    for (let i = 1; i <= 20; i++) {
      this.selectYears.push(year-i);
    }

    for (let i = 1; i <= 3; i++) {
      this.selectYears.unshift(year+i);
    }
  }

  setToday() {
    this.suiveuseS.displayMonth = moment().toDate();
    this.dateSelect(moment().toDate());
  }

  previousMonth(): void {
    this.suiveuseS.displayMonth = moment(this.suiveuseS.displayMonthValue).subtract(1, 'month').toDate();
  }

  nextMonth() {
    this.suiveuseS.displayMonth = moment(this.suiveuseS.displayMonthValue).add(1, 'month').toDate();
  }

  onMonthSelect(monthNumber) {
    this.suiveuseS.displayMonth = moment(this.suiveuseS.displayMonthValue).set('month', monthNumber).toDate();
  }

  onYearSelect(year) {
    this.suiveuseS.displayMonth = moment(this.suiveuseS.displayMonthValue).set('year', year).toDate();
  }

  dateSelect(date): void {
    this.suiveuseS.selectedDate.next(moment(date).toDate());
  }

  /**
  *  Retourne les semaine et les jours associés pour un mois donné
  **/
  private initMonths(): void {
    let dates: {weekNumber: number, days: Date[]}[] = [];
    let firstDayMonth = moment(this.suiveuseS.displayMonthValue).startOf('month').startOf('week');
    let lastDayMonth = moment(this.suiveuseS.displayMonthValue).endOf('month').endOf('week');

    while (!moment(firstDayMonth).isAfter(lastDayMonth, 'day')) {
      if ( dates.findIndex(e => e.weekNumber == firstDayMonth.week()) === -1 ) {
        dates.push({weekNumber: firstDayMonth.week(), days:[]});
      }
      const week = dates.find(e => e.weekNumber == firstDayMonth.week())
      week.days.push(firstDayMonth.toDate());
      firstDayMonth.add(1, 'days');
    }

    this.dates.next(dates);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => {s.unsubscribe()});
  }

}
