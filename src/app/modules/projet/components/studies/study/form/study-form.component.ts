import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap, map, filter, distinctUntilChanged, finalize } from "rxjs/operators";

import { dateFundingTypeAsyncValidator } from '@projet/controls/funding-type-control/date-funding-type.validator';
import { StudyService } from '../study.service';
import { StudiesRepository } from '@projet/repository/studies.repository';
import { Study } from '@projet/repository/project.interface';
import { GlobalsService } from '@shared/services/globals.service';

@Component({
  selector: 'app-projet-study-form',
  templateUrl: './study-form.component.html',
  styleUrls: ['./study-form.component.scss']
})
export class StudyFormComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public saving: boolean = false;
  private _subscriptions: Subscription[] = [];

  get study() {
		return this.studyS.study.getValue();
	}

  get initValues() {
    return {
      availableForAll: false,
      localisations: [],
      managers: []
    };
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  	private studyS: StudyService,
    private studyR: StudiesRepository,
    private globalS: GlobalsService,
  ) { }

  ngOnInit() {

  	this.form = this.fb.group({
      label: [null, Validators.required],
      localAttachment: [null, Validators.required],
      objectif: [null],
      dateStart: [null, Validators.required],
      dateEnd: [null],
      groupeTaxo: [null],
      milieu: [null],
      availableForAll: [false, Validators.required],
      localisations: this.fb.array([]),
      managers: this.fb.array([]),
    });

    this._subscriptions.push(
      this.studyS.study.asObservable()
            .pipe(
              map(study => study !== null ? study : this.initValues),
              tap((study) => {
                study.managers.forEach(e => this.addManager());
                study.localisations.forEach(e => this.addLocalisation());
              })
            )
            .subscribe(study => this.form.patchValue(study))
    );

    this._subscriptions.push(
      this.form.get('availableForAll').valueChanges
        .subscribe(isAvailableForAll => {
          if (isAvailableForAll) {
            this.form.get('groupeTaxo').disable();
            this.form.get('milieu').disable();
            this.form.get('localisations').disable();
            this.form.get('managers').disable();
          } else {
            this.form.get('groupeTaxo').enable();
            this.form.get('milieu').enable();
            this.form.get('localisations').enable();
            this.form.get('managers').enable();
          }

        })
    );
  }

  addManager() {
    (this.form.get('managers') as FormArray).push(new FormControl(null, Validators.required));
  }

  removeManager(index) {
    (this.form.get('managers') as FormArray).removeAt(index);
  }

  addLocalisation() {
    (this.form.get('localisations') as FormArray).push(new FormControl(null, Validators.required));
  }

  removeLocalisation(index) {
    (this.form.get('localisations') as FormArray).removeAt(index);
  }

  cancel() {
    this.form.reset(); 
  }

  private submit(): void {   
    this.saving = true;
    let api;
    if (this.study) {
      //update
      api = this.studyR
        .patch(
          this.study['@id'], 
          this.form.value
        );
        
    } else {
      //create
      api = this.studyR.createStudy(this.form.value);
    }

    api
      .pipe(
        tap(()=>this.saving = false),
        tap((study: Study)=>this.studyS.study.next(study)),
        tap(() => this.globalS.snackBar({msg: "Enregistrement effectué"}))
      )
      .subscribe(
        (study: Study) => this.router.navigate(['/projet/etudes/', study.id]),
        (err) => {
          this.saving = false;
          if ( err.status = 422) {
            err.error.violations.forEach(e => {
              if ( this.form.get(e.propertyPath) !== null)
                this.form.get(e.propertyPath).setErrors({invalide: true, message: e.message});
            });
          }
        }
      );
  }

  save() {
    if (this.form.valid)
  	  this.submit();
  }

  // cancel() {
  //   this.studyS.reset();
  //   this.studyS.displayForm = false;
  // }

  ngOnDestroy() {
    this._subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

}
