import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, concat } from 'rxjs';
import { filter, tap, map, switchMap } from 'rxjs/operators';

import { ChargeTypeRepository } from '../../../../repository/charge-type.repository';
import { ChargeType, ChargeTypeRef } from '../../../../repository/project.interface';
import { ChargeTypeService } from './charge-type.service';

@Injectable()
export class ChargeTypeRefService {

	public totalItems: BehaviorSubject<number> = new BehaviorSubject(0);
  public chargeTypeRefs: ChargeTypeRef[] = [];
	public chargeTypeRefSelect: BehaviorSubject<ChargeTypeRef> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;
	//gestion affichages sur pages personnes display list/form
	public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
  	private chargeTypeR: ChargeTypeRepository,
    private chargeTypeS: ChargeTypeService
  ) { 
  	this.initForm();
  	this.setObservables();

  	this.loadChargeTypeRefs();
  }

  private get initialValues(): ChargeTypeRef {
    return {
      orderBy: this.totalItems.getValue() + 1,
      isPerDay: false
    };
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      label: [null, Validators.required],
      description: [null],
      orderBy: [null, Validators.required],
      isPerDay: [null, Validators.required]
    });

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    this.chargeTypeRefSelect.asObservable()
      .pipe(
        tap(() => {
          //On vide préalablement le FormArray //.clear() existe en angular 8
          this.reset();
        }),
        switchMap((chargeTypeRef) => {
          //on oriente la source des données pour patcher le formulaire
          return chargeTypeRef ? this.chargeTypeRefSelect : of(this.initialValues);
        }),
        tap((chargeTypeRef) => {
          //mise en place des salarieForm
          if (chargeTypeRef.id === undefined) {
            this.addChargeType();
          }
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });

      concat(this.totalItems.asObservable(), this.chargeTypeRefSelect.asObservable())
        .pipe(
          filter((totalItems: number, chargeTypeRefSelect) => chargeTypeRefSelect !== null),
          map((totalItems: number, chargeTypeRefSelect): number => totalItems)
        )
        .subscribe((totalItems: number) => this.form.get('orderBy').setValue(totalItems + 1))
  }

  submit(): void { 	
    this.waiting = true;
    if (this.chargeTypeRefSelect.getValue()) {
      //update
      this.chargeTypeR
        .updateChargeTypeRef(
          (this.chargeTypeRefSelect.getValue()).id,
          this.form.value
        )
        .pipe(
        	tap((): void => {
	        	this.waiting = false;
	        	this.reset();
            this.moveStepper(0);
            this.loadChargeTypeRefs();
	        })
	      )
        .subscribe(
          (chargeTypeRef: ChargeTypeRef) => this.chargeTypeRefSelect.next(chargeTypeRef),
          (err) => {
            this.waiting = false;
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
    } else {
      //create
      this.chargeTypeR
        .createChargeTypeRef(this.form.value)
        .pipe(
        	tap((): void => {
        		this.waiting = false;
            this.reset();
            this.moveStepper(0);
            this.loadChargeTypeRefs();
        	})
        )
        .subscribe(
          (typeProjetRef: ChargeTypeRef) => this.chargeTypeRefSelect.next(typeProjetRef),
          (err) => {
            this.waiting = false;
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
    }
  }

  delete(item: ChargeTypeRef): void {
  	const idx = this.chargeTypeRefs.findIndex((typeProjetRef)=>typeProjetRef.id == item.id);
    if (idx > -1) {
    	this.chargeTypeR.deleteChargeTypeRef(item.id)
        .pipe(
          tap(()=>this.chargeTypeRefSelect.next(null))
        )
    		.subscribe(data => this.loadChargeTypeRefs());
    }
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
	}

  reset() {
    this.form.reset(this.initialValues);
    this.clearFormArray(
      this.form.get("salaries") as FormArray
    );
  }

  addChargeType(): void {
    if (this.form.get('chargeTypes') === null) {
          this.form.addControl('chargeTypes', this.fb.array([]));
    }
    const form = this.chargeTypeS.createForm();
    (this.form.get('chargeTypes') as FormArray).push(form);
    form.parent.parent.get('isPerDay').valueChanges
      .subscribe(val=>{
        if (!val) {
          form.addControl('unitCost', new FormControl(null, Validators.required));
        } else {
          form.removeControl('unitCost');
        }
      });
  }

  loadChargeTypeRefs() {
    this.chargeTypeR.chargeTypeRefs()
      .pipe(
        tap((data: any)=>this.totalItems.next(data["hydra:totalItems"])),
        map((data: any): ChargeTypeRef[]=>data["hydra:member"])
      )
      .subscribe(
        (chargeTypeRefs: ChargeTypeRef[]) => this.chargeTypeRefs = chargeTypeRefs
      );
  }

  private clearFormArray(formArray: FormArray) {
    if (this.form.get('chargeTypes')) {
      this.form.removeControl('chargeTypes');
    }
  }
}
