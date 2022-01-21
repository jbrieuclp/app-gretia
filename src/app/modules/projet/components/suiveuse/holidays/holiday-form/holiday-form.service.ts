import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { BehaviorSubject, combineLatest } from "rxjs";
import { tap, map, startWith, distinctUntilChanged, filter } from "rxjs/operators";
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../../suiveuse.service';
import { Holiday } from '../../../../repository/project.interface';

@Injectable()
export class HolidayFormService {

  public form: FormGroup;
  holiday: BehaviorSubject<Holiday> = new BehaviorSubject(null);

  constructor(
    private fb: FormBuilder,
    private suiveuseS: SuiveuseService,
  ) { 
    this.initForm();

    this.setObservables();
  }

  get initialValues(): any {
    const values = {
            holidayDate: moment(this.suiveuseS.selectedDate.getValue()).format('YYYY-MM-DD'),
            morning: false,
            evening: false,
          };
    return values;
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      holidayDate: [null, [Validators.required]],
      morning: [null, [Validators.required]],
      evening: [null, [Validators.required]],
    });
  }

  private setObservables() {
    this.holiday.asObservable()
      .pipe(
        tap(() => this.form.reset()),
        map((holiday): any => holiday !== null ? holiday : this.initialValues),
      )
      .subscribe((data: any) => this.form.patchValue(data));
  }

  reset() {
    this.holiday.next(null);
  }
}