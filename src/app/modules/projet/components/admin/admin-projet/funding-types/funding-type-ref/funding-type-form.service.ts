import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class FundingTypeFormService {
  constructor(private fb: FormBuilder) {}

  createForm(value): FormGroup {
    let form = this.fb.group({
      applicationStart: [null, Validators.required],
      applicationEnd: [null],
      dailyCost: [null, Validators.required]
    });

    form.patchValue(value);
    return form;
  }
}