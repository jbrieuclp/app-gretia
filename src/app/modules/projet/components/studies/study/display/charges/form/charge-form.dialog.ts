import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray, AbstractControl } from "@angular/forms";
import { Observable, of } from 'rxjs';
import { distinctUntilChanged, switchMap, map, tap, filter } from 'rxjs/operators';

import { StudiesRepository } from '@projet/repository/studies.repository';
import { Study, Charge, ChargeType, ProjectType } from '@projet/repository/project.interface';
import { ChargeTypeRepository } from '@projet/repository/charge-type.repository';
import { StudyService } from '../../../study.service';
import { StudyChargesService } from '../charges.service';

@Component({
  selector: 'app-projet-study-charge-form',
  templateUrl: './charge-form.dialog.html',
  styleUrls: ['./charge-form.dialog.scss']
})
export class ChargeFormDialog implements OnInit {

	public form: FormGroup;
  charge: Charge = null;
  formParam: any = {};
  saving: boolean = false;

	get study(){ return this.studyS.study.getValue(); }
  get charges(){ return this.studyChargesS.charges.getValue(); }

  constructor(
    public dialogRef: MatDialogRef<ChargeFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  	private fb: FormBuilder,
  	private studyS: StudyService,
  	private chargeTypeR: ChargeTypeRepository,
  	private studyR: StudiesRepository,
    private studyChargesS: StudyChargesService,
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
      study: this.study['@id'],
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
      study: [null, Validators.required],
    });

    this.form.patchValue(this.charge !== null ? this.charge : this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {
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

    this.saving = true;
    let api;

    if (this.charge === null) {
      //create
      api = this.studyR.createCharge(this.form.value)
        .pipe(
        	tap((charge: Charge) => this.charges.push(charge))
        );
    } else {
      //update
      api = this.studyR.patch(this.charge['@id'], this.form.value)
        .pipe(
          tap((charge: Charge) => Object.assign(this.charge, charge))
        );
    }

    api
      .pipe(
        tap(()=>this.saving = false)
      )
      .subscribe(
          (charge: Charge) => this.cancel(),
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
