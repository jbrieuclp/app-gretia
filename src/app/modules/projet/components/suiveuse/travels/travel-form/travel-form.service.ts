import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../../suiveuse.service';
import { Travel } from '../../../../repository/project.interface';

@Injectable()
export class TravelFormService {

  public form: FormGroup;
  travel: BehaviorSubject<Travel> = new BehaviorSubject(null);

  constructor(
    private fb: FormBuilder,
    private suiveuseS: SuiveuseService,
  ) { 
    this.initForm();
    this.setObservable();
  }

  get initialValues(): any {
    const values = {
            duration: 0,
            isDriver: true,
            travelDate: moment(this.suiveuseS.selectedDate.getValue()).format('YYYY-MM-DD'),
          };
    return values;
  }

  private initForm(): void {
    //FORM
    this.form = this.fb.group({
      study: [null, [Validators.required]],
      travel: [null, [Validators.required]],
      travelDate: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      distance: [null, [Validators.required]],
      isDriver: [null, [Validators.required]],
    });
  }

  private setObservable() {
    this.form.get('isDriver').valueChanges
      .pipe(
        tap((state: boolean) => {
          if (!state) {
            this.form.get('distance').setValue(null);
            this.form.get('distance').setValidators([]);
          } else {
            this.form.get('distance').setValidators([Validators.required]);
          }
        })
      )
      .subscribe((state: boolean) => this.form.get('distance').updateValueAndValidity());

    this.travel.asObservable()
      .pipe(
        tap(() => this.form.reset()),
        map((travel): any => {
          if (travel !== null) {
            const data = Object.assign({}, travel);
            data.study = data.study['@id'];
            return data;
          } 
          return this.initialValues;
        }),
        tap((data: any) => this.form.patchValue(data))
      )
      .subscribe(() => this.form.updateValueAndValidity());
  }

  reset() {
    this.travel.next(null);
  }
}