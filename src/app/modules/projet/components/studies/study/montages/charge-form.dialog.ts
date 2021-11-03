import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl } from "@angular/forms";
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, switchMap, map, tap, filter } from 'rxjs/operators';
import { StudiesRepository } from '../../../../repository/studies.repository';
import { Study, Charge, ChargeType, ProjectType } from '../../../../repository/project.interface';
import { ChargeTypeRepository } from '../../../../repository/charge-type.repository';
import { ProjectsRepository } from '../../../../repository/projects.repository';
import { StudyService } from '../study.service';

@Component({
  selector: 'app-projet-study-display-charge-form',
  templateUrl: './charge-form.dialog.html',
  styleUrls: ['./charge-form.dialog.scss']
})
export class ChargeFormDialog implements OnInit {

	public form: FormGroup;
  charge: Charge = null;
  formParam: any = {};
  waiting: boolean = false;

	get study(){ return this.studyS.study.getValue(); }
  get project(){ return this.studyS.study.getValue(); }

  constructor(
    public dialogRef: MatDialogRef<ChargeFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  	private fb: FormBuilder,
  	private studyS: StudyService,
  	private chargeTypeR: ChargeTypeRepository,
  	private studyR: StudiesRepository,
    private projectsR: ProjectsRepository,
  ) {
    this.charge = data.charge;
    this.formParam = data.formParam;
  }

  ngOnInit() {
  	this.initForm();
  	this.setObservables();
  }

  private get initialValues(): Charge {
    return {
      unitCostApplied: 1,
      quantity: 1,
      autofunding: false,
    };
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      label: [null, Validators.required],
      description: [null],
      unitCostApplied: [null, Validators.required],
      quantity: [null, Validators.required],
      chargeType: [null, Validators.required],
      // autofunding: [null, Validators.required],
      study: [null, Validators.required],
    });

    if (this.charge !== null) {
      this.form.patchValue(this.charge);
    } else {
      this.form.patchValue(this.initialValues);
    }
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

  	this.studyS.study.asObservable()
  		.pipe(
  			tap(() => this.form.get('study').setValue(null)),
  			filter((study: Study) => study !== null),
        tap((study: Study) => {
          if (this.charge === null && this.formParam.isPerDay) {
            this.form.get('unitCostApplied').setValue(study.dailyCost);
          }
        })
  		)
  		.subscribe((study: Study) => this.form.get('study').setValue(study['@id']));

  	this.form.get('chargeType').valueChanges
  		.pipe(
        filter(() => this.formParam.isPerDay === false),
        tap(()=>this.form.get('unitCostApplied').disable()),
        filter((val: any) => val !== null && (typeof val === 'string' || val instanceof String)),
  			switchMap((chargeTypeID: string): Observable<ChargeType> => this.chargeTypeR.get(chargeTypeID)),
        map((chargeType: ChargeType): number => chargeType.unitCost),
  			tap(()=>this.form.get('unitCostApplied').enable()),
  		)
  		.subscribe(val => this.form.get('unitCostApplied').setValue(val));
  }

  submit(): void { 	
    if ( !this.form.valid ) {
      return;
    }

    this.waiting = true;
    let api;

    if (this.charge === null) {
      //create
      api = this.studyR
        .createCharge(this.form.value)
        .pipe(
        	tap((): void => {
            this.form.reset(this.initialValues);
        	})
        );
    } else {
      //update
      console.log(this.form.value)
      api = this.studyR
        .updateCharge(this.charge.id, this.form.value)
        .pipe(
          tap((): void => {
            this.form.reset(this.initialValues);
          })
        );
    }

    api
      .pipe(
        tap(()=>this.waiting = false)
      )
      .subscribe(
          (charge: Charge) => this.dialogRef.close(charge),
          (err) => {
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
  }

  cancel() {
    this.form.reset(this.initialValues); 
    this.dialogRef.close(false);
  }
}
