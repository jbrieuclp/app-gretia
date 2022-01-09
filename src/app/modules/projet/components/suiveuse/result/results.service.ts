import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, NavigationStart, RoutesRecognized, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable, forkJoin, combineLatest } from 'rxjs';
import { filter, map, distinctUntilChanged, tap, switchMap, startWith } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../suiveuse.service';
import { WorksRepository } from '@projet/repository/works.repository';
import { Work, Expense, Travel } from '@projet/repository/project.interface';

@Injectable()
export class WorkingTimeResultsService {

  works: Work[] = [];
  worksLoading: boolean = false;

  travels: Travel[] = [];
  travelsLoading: boolean = false;

  expenses: Expense[] = [];
  expensesLoading: boolean = false;

  get personForm() { return this.suiveuseS.personForm; }
  get selectedDate() { return this.suiveuseS.selectedDate; }

  constructor(
    private suiveuseS: SuiveuseService,
    private worksR: WorksRepository,
  ) { 
  	this.setObservables();
  }

  setObservables() {
    //charge les 
    combineLatest(
      this.personForm.valueChanges
        .pipe(
          startWith(this.personForm.value)
        ),
      this.selectedDate.asObservable()
        .pipe(
          map((val) => moment(val).format('YYYY-MM-DD')),
          distinctUntilChanged(),
        )
    )
      .pipe(
        switchMap(() => this.getResults())
      )
      .subscribe((val) => console.log(val));
  }

  getResults(params?: any): Observable<any> {
    return forkJoin(
      this.getWorks(params),
      this.getTravels(params),
      this.getExpenses(params),
    )
  }

  getWorks(params?: any): Observable<Work[]> {
    this.worksLoading = true;
    this.works = [];

    if (params === undefined) {
      params = {
        compteId: this.personForm.value,
        'workingDate[after]': moment(this.selectedDate.getValue()).format('YYYY-MM-DD'),
        'workingDate[before]': moment(this.selectedDate.getValue()).format('YYYY-MM-DD'),
      }
    }

    return this.worksR.works(params)
      .pipe(
        // tap(() => this.searching = false),
        tap(() => this.worksLoading = false),
        map((data: any): Work[] => data["hydra:member"]),
        tap((works: Work[]) => this.works = works)
      );
  } 

  getTravels(params?: any): Observable<Travel[]> {
    this.travelsLoading = true;
    this.travels = [];

    if (params === undefined) {
      params = {
        compteId: this.personForm.value,
        'travelDate[after]': moment(this.selectedDate.getValue()).format('YYYY-MM-DD'),
        'travelDate[before]': moment(this.selectedDate.getValue()).format('YYYY-MM-DD'),
      }
    }

    return this.worksR.travels(params)
      .pipe(
        // tap(() => this.searching = false),
        tap(() => this.travelsLoading = false),
        map((data: any): Travel[] => data["hydra:member"]),
        tap((travels: Travel[]) => this.travels = travels)
      );
  } 

  getExpenses(params?: any): Observable<Expense[]> {
    this.expensesLoading = true;
    this.expenses = [];
    
    if (params === undefined) {
      params = {
        compteId: this.personForm.value,
        'expenseDate[after]': moment(this.selectedDate.getValue()).format('YYYY-MM-DD'),
        'expenseDate[before]': moment(this.selectedDate.getValue()).format('YYYY-MM-DD'),
      }
    }

    return this.worksR.expenses(params)
      .pipe(
        // tap(() => this.searching = false),
        tap(() => this.expensesLoading = false),
        map((data: any): Expense[] => data["hydra:member"]),
        tap((expenses: Expense[]) => this.expenses = expenses)
      );
  } 
}