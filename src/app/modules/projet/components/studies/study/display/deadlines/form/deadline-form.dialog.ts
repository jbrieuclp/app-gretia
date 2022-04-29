import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl } from "@angular/forms";

import { StudyService } from '../../../study.service';
import { StudyDeadline, Study } from '@projet/repository/project.interface';

@Component({
  selector: 'app-project-study-deadline-form',
  templateUrl: './deadline-form.dialog.html',
  styleUrls: ['./deadline-form.dialog.scss']
})
export class StudyDeadlineFormDialog implements OnInit {

  get study() { return this.studyS.study.getValue(); };
  public form: FormGroup;
  public deadline: StudyDeadline;
  public saving: boolean = false;

  private get initialValues(): StudyDeadline {
    return {
      study: this.study['@id'],
    };
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudyDeadlineFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studyS: StudyService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      deadlineType: [null, Validators.required],
      date: [null, Validators.required],
      comment: [null],
      study: [null, Validators.required],
    });

    this.form.patchValue(this.deadline !== null ? this.deadline : this.initialValues);
  }

  submit() {
    return;
  }

  cancel() {
    this.form.reset(this.initialValues); 
    this.dialogRef.close(false);
  }

}
