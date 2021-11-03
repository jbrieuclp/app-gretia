import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Injectable()
export class EmployeeFormService {
  
  constructor(private fb: FormBuilder) {}

  createForm(value): FormGroup {
    let form = this.fb.group({
      function: [null, Validators.required],
      antenne: [null, Validators.required],
      contractStart: [null, Validators.required],
      contractEnd: [null],
      rate: [null, Validators.required]
    });

    form.patchValue(value);
    return form;
  }
}