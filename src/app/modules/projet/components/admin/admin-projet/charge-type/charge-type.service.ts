import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';

import { ChargeType } from '../../../../repository/project.interface'

@Injectable()
export class ChargeTypeService {

	public chargeType: BehaviorSubject<ChargeType> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;

  constructor(
  	private fb: FormBuilder
  ) { }

  private get initialValues(): ChargeType {
    return {};
  }

  createForm(): FormGroup {
    //FORM
    const form: FormGroup = this.fb.group({
      applicationStart: [null, Validators.required],
      applicationEnd: null,
      unit_cost: [null, Validators.required]
    });

    form.patchValue(this.initialValues);

    this.setObservables();

    return form;
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {
    // this.form.get('applicationDebut').valueChanges
    //   .pipe(
    //     filter((date)=>date!==null),
    //     map(date=>{
    //       const input = date.creationData().input;
    //       input.replace(/^(\d{1,2})\/?(\d{1,2})?\/?(\d{4})?$/, (c, p1, p2, p3, d, s)=>{
    //         console.log(c, p1, p2, p3, d, s)
    //         console.log([p1, p2, p3].join('/'))
    //         return [p1, p2, p3].join('/')});
    //       console.log(input);
    //       return date;
    //     })
    //   )
    //   .subscribe(val=>console.log(val.creationData().input));
  }

  reset() {
    this.form.reset(this.initialValues);
  }
}