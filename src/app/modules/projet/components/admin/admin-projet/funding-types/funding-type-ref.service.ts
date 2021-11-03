import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, map, switchMap, catchError } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../shared';
import { FundingTypeRepository } from '../../../../repository/funding-type.repository';
import { FundingTypeRef } from '../../../../repository/project.interface';
import { FundingTypeFormService } from './funding-type-ref/funding-type-form.service';

@Injectable()
export class FundingTypeRefService {

  public totalItems: number = 0;
  public _fundingTypeRefs: BehaviorSubject<FundingTypeRef[]> = new BehaviorSubject([]);
  get fundingTypeRefs(): FundingTypeRef[] { return this._fundingTypeRefs.getValue(); }
  public fundingTypeRef: BehaviorSubject<FundingTypeRef> = new BehaviorSubject(null);
  public form: FormGroup;
  public waiting: boolean = false;
  public loadingList: boolean = false;
  //gestion affichages sur pages fundingTypeRefs display list/form
  public stepper: MatStepper;

  constructor(
    private fb: FormBuilder,
    private fundingTypeR: FundingTypeRepository,
    private fundingTypeFormS: FundingTypeFormService,
    private globalsS: GlobalsService,
  ) { 
    this.initForm();
    this.setObservables();

    this.getFundingTypeRefs().subscribe(() => {return;});
  }

  getFundingTypeRefs(): Observable<FundingTypeRef[]> {
    this.loadingList = true;
    return this.fundingTypeR.fundingTypeRefs()
      .pipe(
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): FundingTypeRef[] => data["hydra:member"]),
        catchError(err => of([])),
        tap((fundingTypeRefs: FundingTypeRef[]) => this._fundingTypeRefs.next(fundingTypeRefs)),
        tap(() => this.loadingList = false),
      );
  }

  private get initialValues(): FundingTypeRef {
    return {};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      label: [null, Validators.required],
      code: [null, Validators.required],
      description: [null],
      orderBy: [null, Validators.required]
    });

    this.addProjectTypeForm();

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    //patch le form par les valeurs par defaut si creation
    this.fundingTypeRef.asObservable()
      .pipe(
        tap(() => this.reset()),
        filter((fundingTypeRef)=>fundingTypeRef !== null),
        tap((fundingTypeRef) => {
          //Pour une modification (c'est forcément le cas ici) on supprime les form salariés
          this.clearFormArray("fundingTypes");
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });
  }

  submit(): void {   
    this.waiting = true;
    let api;
    if (this.fundingTypeRef.getValue()) {
      //update
      api = this.fundingTypeR.patch((this.fundingTypeRef.getValue())['@id'], this.form.value);
    } else {
      //create
      api = this.fundingTypeR.createFundingTypeRef(this.form.value);
    }

    api
      .pipe(
        tap((): void => {
          this.waiting = false;
          this.reset();
          this.moveStepper(0);
        }),
        tap((fundingTypeRef: FundingTypeRef) => this.fundingTypeRef.next(fundingTypeRef)),
        switchMap(() => this.getFundingTypeRefs())
      )
      .subscribe(
        () => this.globalsS.snackBar({msg: "Enregistrement effectué"}),
        (err) => {
          err.error.violations.forEach(e => {
            this.globalsS.snackBar({msg: e.message, color: 'red', duration: null});
            this.form.get(e.propertyPath).setErrors({'inUse': true});
          })
        }
      );
  }

  delete(item: FundingTypeRef): void {
    const idx = this.fundingTypeRefs.findIndex((fundingTypeRef)=>fundingTypeRef.id == item.id);
    if (idx > -1) {
      this.fundingTypeR.delete(item['@id'])
        .pipe(
          tap(()=>this.fundingTypeRef.next(null))
        )
        .subscribe(data => this.fundingTypeRefs.splice(idx, 1));
    }
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
  }

  reset() {
    this.form.reset(this.initialValues);
    this.clearFormArray("fundingTypes");
    this.addProjectTypeForm();
  }

  addProjectTypeForm(): void {
    this.form.addControl('fundingTypes', this.fb.array([]));
    (this.form.get('fundingTypes') as FormArray).push(
      this.fundingTypeFormS.createForm({})
    );
  }

  private clearFormArray(item: string) {
    if (this.form.get(item)) {
      this.form.removeControl(item);
    }
  }
}
