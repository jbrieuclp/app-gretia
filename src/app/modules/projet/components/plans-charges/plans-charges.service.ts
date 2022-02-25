import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { distinctUntilChanged, switchMap, map, tap, filter } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { Person, Study } from '@projet/repository/project.interface';
import { StudiesRepository } from '@projet/repository/studies.repository';

@Injectable({
  providedIn: 'root'
})
export class PlansChargesService {

  private _person: BehaviorSubject<Person> = new BehaviorSubject(null);
  set person(value) { this._person.next(value); };
  get person() { return this._person.value; };
  get $person() { return this._person.asObservable(); };

  private _year: BehaviorSubject<number> = new BehaviorSubject(moment().year());
  set year(value) { this._year.next(value); };
  get year() { return this._year.value; };
  get $year() { return this._year.asObservable(); };

  private _studies: BehaviorSubject<Study[]> = new BehaviorSubject([]);
  set studies(value) { this._studies.next(value); };
  get studies() { return this._studies.value; };
  get $studies() { return this._studies.asObservable(); };

  constructor(
    private studyR: StudiesRepository,
  ) { 
  }

}
