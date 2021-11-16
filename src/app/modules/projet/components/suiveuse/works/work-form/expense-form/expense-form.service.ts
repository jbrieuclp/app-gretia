import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { BehaviorSubject } from "rxjs";
import { map, tap } from "rxjs/operators";

import { Work } from '../../../../../repository/project.interface';

@Injectable()
export class ExpenseFormService {

  public form: FormGroup;
  work: BehaviorSubject<Work> = new BehaviorSubject(null);

  constructor(
    private fb: FormBuilder,
  ) { 
    this.initForm();
  }

  private get initialValues(): any {
    const values = {
            amountExclTax: 0,
            vat: 0,
            amountInclTax: 0,
          };
    return values;
  }

  getForm(): FormGroup {
    return this.fb.group({
      chargeType: [null, [Validators.required]],
      provider: [null, [Validators.required]],
      details: [null],
      amountExclTax: [null, [Validators.required]],
      vat: [null, [Validators.required]],
      amountInclTax: [null, [Validators.required]],
    });
  }

  initForm(): void {
    //FORM
    this.form = this.getForm();
  }

  reset() {
    this.form.reset(this.initialValues);
  }
}