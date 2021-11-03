import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';

import { Travel } from '../../../../../repository/project.interface';

@Component({
  selector: 'app-projet-work-travel-form-dialog',
  templateUrl: './travel-form.dialog.html',
  styleUrls: ['./travel-form.dialog.scss']
})
export class TravelFormDialog implements OnInit {

  form: FormGroup;
  travel: Travel = {};

  constructor(
    public dialogRef: MatDialogRef<TravelFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) { 
    this.travel = this.data.travel;
  }

  private get initialValues(): any {
    const values = {
            travel: "",
            duration: 0,
            distance: 0,
            carpool: false,
          };
    return values;
  }

  ngOnInit() {
    this.form = this.fb.group({
      travel: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      distance: [null, [Validators.required]],
      carpool: [null, [Validators.required]],
    });

    this.form.patchValue(_.isEmpty(this.travel) ? this.initialValues : this.travel);
  }

  ajouter() {
    if (this.form.valid) {
      this.dialogRef.close(Object.assign(this.travel, this.form.value));
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
