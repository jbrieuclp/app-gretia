import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { tap } from "rxjs/operators";

import { dateFundingTypeAsyncValidator } from '../../../../controls/funding-type-control/date-funding-type.validator';
import { StudyService } from '../study.service';
import { StudiesRepository } from '../../../../repository/studies.repository';
import { Study } from '../../../../repository/project.interface';

@Component({
  selector: 'app-projet-study-form',
  templateUrl: './study-form.dialog.html',
  styleUrls: ['./study-form.dialog.scss']
})
export class StudyFormDialog implements OnInit {

  public form: FormGroup;
  public waiting: boolean = false;

  get study() {
		return this.studyS.study.getValue();
	}

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudyFormDialog>,
  	private studyS: StudyService,
    private studyR: StudiesRepository,
  ) { }

  ngOnInit() {
  	this.form = this.fb.group({
      label: [null, Validators.required],
      objectif: [null],
      dateStart: [null, Validators.required],
      dateEnd: [null],
      groupeTaxo: [null],
      milieu: [null],
      // localisations: this.fb.array([], Validators.required),
      // responsables: this.fb.array([], Validators.required),
    });

    this.form.patchValue(this.study || {});
  // }
  }

  cancel() {
    this.form.reset(); 
    this.dialogRef.close(null);
  }

  submit(): void {   
    this.waiting = true;
    let api;
    if (this.study) {
      //update
      api = this.studyR
        .patch(
          this.study['@id'], 
          Object.assign(this.study, this.form.value)
        );
        
    } else {
      //create
      api = this.studyR.createStudy(this.form.value);
    }

    api
      .pipe(
        tap(()=>this.waiting = false),
        tap((study: Study)=>this.studyS.study.next(study))
      )
      .subscribe(
        (study: Study) => this.dialogRef.close(study),
        (err) => {
          this.waiting = false;
          if ( err.status = 422) {
            err.error.violations.forEach(e => {
              if ( this.form.get(e.propertyPath) !== null)
                this.form.get(e.propertyPath).setErrors({invalide: true, message: e.message});
            });
          }
        }
      );
  }

  // save() {
  // 	this.studyS.submit();
  // }

  // cancel() {
  //   this.studyS.reset();
  //   this.studyS.displayForm = false;
  // }

  // get tacheControls() {
  //   return (this.form.get("taches") as FormArray)
  //     .controls;
  // }

  // get responsables() {
  //   return this.studyS.responsables;
  // }

  // addResponsable() {
  // 	this.studyS.addResponsable();
  // }

  // removeResponsable(i: number) {
  // 	this.studyS.removeResponsable(i);
  // }

  // get localisations() {
  //   return this.studyS.localisations;
  // }

  // addLocalisation() {
  // 	this.studyS.addLocalisation();
  // }

  // removeLocalisation(i: number) {
  // 	this.studyS.removeLocalisation(i);
  // }

}
