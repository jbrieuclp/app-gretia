import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../../suiveuse.service';
import { Work } from '../../../../repository/project.interface';

@Injectable()
export class WorkFormService {

  public form: FormGroup;
  work: BehaviorSubject<Work> = new BehaviorSubject(null);

  constructor(
    private fb: FormBuilder,
    private suiveuseS: SuiveuseService,
  ) { 
    this.initForm();
  }

  private get initialValues(): any {
    const values = {
            isNight: false,
            isWe: false,
            workingDate: moment(this.suiveuseS.selectedDate.getValue()).format('YYYY-MM-DD'),
          };
    return values;
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      action: [null, [Validators.required]],
      workingDate: [null, [Validators.required]],
      duration: [null, [Validators.required, Validators.pattern('^[0-9]+\.?[0-9]*$')]],
      detail: null,
      isNight: [null, [Validators.required]],
      isWe: [null, [Validators.required]],
      travels: this.fb.array([])
    });


    this.work.asObservable()
      .pipe(
        map((work): any => {
          if (work !== null) {
            const data = Object.assign({}, work);
            data.action = data.action['@id'];
            return data;
          } 
          return this.initialValues;
        })
      )
      .subscribe((data: any) => this.form.patchValue(data));
  }

  private isWeekend(date): boolean {
    return moment(date).isoWeekday() === 6 || moment(date).isoWeekday() === 7;
  }

  reset() {
    this.form.reset(this.initialValues);
    this.form.get('isWe').setValue(this.isWeekend(this.suiveuseS.selectedDate.getValue()))
  }
}