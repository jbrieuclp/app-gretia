import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationStart, RoutesRecognized, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin, combineLatest, Subject } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { AuthService } from '@shared/auth/authentication.service';
import { PersonRepository } from '@projet/repository/person.repository';
import { EmployeeRepository } from '@projet/repository/employee.repository';
import { SuiveuseRepository } from '@projet/repository/suiveuse.repository';
import { WorksRepository } from '@projet/repository/works.repository';
import { Work, Travel, Holiday } from '@projet/repository/project.interface';

@Injectable()
export class SuiveuseService {

  /* Date selectionnée sur le calendrier */
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());
  selectedDateWorkTime: BehaviorSubject<any> = new BehaviorSubject(null);

  _displayMonth: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());
  set displayMonth(value: any) { this._displayMonth.next(value); }
  get displayMonth() { return this._displayMonth; }
  get displayMonthValue() { return this._displayMonth.getValue(); }

  personForm: FormControl = new FormControl();

  //dernier jours rafraichie pour permettre la mise à jours de la vue
  lastRefreshDay: Subject<Date> = new Subject();
  _dateWorkTime: BehaviorSubject<any[]> = new BehaviorSubject([]);
  set dateWorkTime(value) { this._dateWorkTime.next(value); };
  get dateWorkTime() { return this._dateWorkTime.value; };
  get $dateWorkTime() { return this._dateWorkTime.asObservable(); };
  loading: boolean = false;

  get isAuthUserData(): boolean { return this.personForm.value === this.authService.getUser().getValue().id };

  constructor(
  	private suiveuseR: SuiveuseRepository,
    private employeeR: EmployeeRepository,
    private worksR: WorksRepository,
    private authService: AuthService
  ) { 
  	this.setObservables();
  }

  setObservables() {
  	combineLatest(
      this.personForm.valueChanges,
      this.displayMonth.asObservable()
    		.pipe(
    			distinctUntilChanged((prev, curr) => moment(prev).isSame(curr, 'month')),
    			map((date): [string, string] => {
    				return [moment(date).startOf('month').startOf('week').format('YYYY-MM-DD'), moment(date).endOf('month').endOf('week').format('YYYY-MM-DD')]
    			})
        )
    )
      .pipe(
        map(([compteId, dates]) => {
          return {
              'date[after]': moment(dates[0]).format('YYYY-MM-DD'), 
              'date[before]': moment(dates[1]).format('YYYY-MM-DD'),
              'compteId': compteId
            }}
        ),
        tap(() => this.dateWorkTime = []),
  			switchMap((params): Observable<any[]> => this.getDataByPeriod(params)),
        tap((data) => this.dateWorkTime = data)
  		)
        .subscribe(() => this.loading = false);

    combineLatest(
      this.selectedDate.asObservable(),
      this.$dateWorkTime
    )
      .pipe(
        map(([date, dateWorkTime]: [Date, any[]]): any => dateWorkTime.find(e => moment(e.date).isSame(moment(date), 'day')))
      )
      .subscribe((dateWorkTime) => this.selectedDateWorkTime.next(dateWorkTime));


    this.authService.getUser().asObservable()
      .pipe(
        map((user: any): number => user.id !== null ? user.id : null),
      )
      .subscribe(userId => this.personForm.setValue(userId))
  }

  getDataByPeriod(params): Observable<any> {
    this.loading = true;

    return this.suiveuseR.getDateWorkTime(params)
      .pipe(
        map((data: any) => data["hydra:member"]),
      );
  }

  refreshDayData(day): void {
    const idx = this.dateWorkTime.findIndex(e => moment(day).isSame(moment(e.date), 'day'));
    if (idx !== -1) {
      this.dateWorkTime.splice(idx, 1);
    }

    this.getDataByPeriod(
      {
        'date[after]': moment(day).format('YYYY-MM-DD'), 
        'date[before]': moment(day).format('YYYY-MM-DD'),
        'compteId': this.personForm.value
      }
    )
      .pipe(
        map((res: any[]): any => res[0]),
        tap((res) => this.dateWorkTime.push(res)),
        tap(() => this.loading = false)
      )
      .subscribe(() => this.lastRefreshDay.next(day));
  }

  getWorks(params): Observable<Work[]> {
    return this.worksR.works({
        'workingDate[after]': params.startDate, 
        'workingDate[before]': params.endDate,
        'compteId': params.compteId
      })
      .pipe(
        map((data: any) => data["hydra:member"])
      );
  }  

  getTravels(params): Observable<Travel[]> {
    return this.worksR.travels({
        'travelDate[after]': params.startDate, 
        'travelDate[before]': params.endDate,
        'compteId': params.compteId
      })
      .pipe(
        map((data: any) => data["hydra:member"])
      );
  }  

  getHolidays(params): Observable<Holiday[]> {
    return this.worksR.holidays({
        'holidayDate[after]': params.startDate, 
        'holidayDate[before]': params.endDate,
        'compteId': params.compteId
      })
      .pipe(
        map((data: any) => data["hydra:member"])
      );
  }  
}