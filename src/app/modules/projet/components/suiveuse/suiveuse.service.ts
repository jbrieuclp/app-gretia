import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationStart, RoutesRecognized, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin, combineLatest } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { AuthService } from '@shared/auth/authentication.service';
import { PersonRepository } from '@projet/repository/person.repository';
import { EmployeeRepository } from '@projet/repository/employee.repository';
import { SuiveuseRepository } from '@projet/repository/suiveuse.repository';
import { WorksRepository } from '@projet/repository/works.repository';
import { Work, Travel, Holiday } from '@projet/repository/project.interface';
import { DateWorkTime } from './date-work-time';

@Injectable()
export class SuiveuseService {

  /* Date selectionnée sur le calendrier */
  selectedDate: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());

  _displayMonth: BehaviorSubject<Date> = new BehaviorSubject(moment().toDate());
  set displayMonth(value: any) { this._displayMonth.next(value); }
  get displayMonth() { return this._displayMonth; }
  get displayMonthValue() { return this._displayMonth.getValue(); }

  personForm: FormControl = new FormControl();

  workByDay: DateWorkTime[] = [];
  loading: boolean = false;

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
              'startDate': moment(dates[0]).format('YYYY-MM-DD'), 
              'endDate': moment(dates[1]).format('YYYY-MM-DD'),
              'compteId': compteId
            }}
        ),
        tap(() => this.workByDay = []),
  			switchMap((params): Observable<DateWorkTime[]> => this.getDataByPeriod(params)),
  		)
        .subscribe(() => this.loading = false);


    this.authService.getUser().asObservable()
      .pipe(
        map((user: any): number => user.id !== null ? user.id : null),
      )
      .subscribe(userId => this.personForm.setValue(userId))
  }

  getDataByPeriod(params): Observable<any> {
    this.loading = true;

    return forkJoin(
      this.getWorks(params),
      this.getTravels(params),
      this.getHolidays(params),
    )
      .pipe(
        tap(([works, travels, holidays]: [Work[], Travel[], Holiday[]]) => {
          const dates: DateWorkTime[] = this.workByDay;
          works.forEach((work: Work) => {
            //si l'objet DateWorkTime correspondant à la date du Work n'existe pas on le créer
            if (dates.findIndex(d => moment(d.date).isSame(moment(work.workingDate), 'day')) === -1) {
              dates.push(new DateWorkTime(moment(work.workingDate).toDate()));
            }

            const date = dates.find(d => moment(d.date).isSame(moment(work.workingDate), 'day'));

            // récupération de l'objet DateWorkTime correspondant à la date du work
            date.addWork(work);
          });

          travels.forEach((travel: Travel) => {
            //si l'objet DateWorkTime correspondant à la date du Work n'existe pas on le créer
            if (dates.findIndex(d => moment(d.date).isSame(moment(travel.travelDate), 'day')) === -1) {
              dates.push(new DateWorkTime(moment(travel.travelDate).toDate()));
            }

            const date = dates.find(d => moment(d.date).isSame(moment(travel.travelDate), 'day'));
            date.addTravel(travel);
          });

          holidays.forEach((holiday: Holiday) => {
            //si l'objet DateWorkTime correspondant à la date du Holiday n'existe pas on le créer
            if (dates.findIndex(d => moment(d.date).isSame(moment(holiday.holidayDate), 'day')) === -1) {
              dates.push(new DateWorkTime(moment(holiday.holidayDate).toDate()));
            }

            const date = dates.find(d => moment(d.date).isSame(moment(holiday.holidayDate), 'day'));
            date.holiday = holiday;
          });
        })
      )
    ;
  }

  refreshDayData(day): void {
    const idx = this.workByDay.findIndex(e => moment(day).isSame(moment(e.date), 'day'));
    if (idx !== -1) {
      this.workByDay.splice(idx, 1);
    }

    this.getDataByPeriod(
      {
        'startDate': moment(day).format('YYYY-MM-DD'), 
        'endDate': moment(day).format('YYYY-MM-DD'),
        'compteId': this.personForm.value
      }
    )
      .subscribe(() => this.loading = false);
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