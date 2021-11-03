import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';

import { FundingTypeRepository } from '../../../../../repository/funding-type.repository';
import { FundingType, FundingTypeRef } from '../../../../../repository/project.interface';
import { FundingTypeFormService } from './funding-type-form.service';
import { FundingTypeRefService } from '../funding-type-ref.service';

@Injectable()
export class FundingTypeService {

	public fundingTypeRef: FundingTypeRef;
  public fundingType: BehaviorSubject<FundingType> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;

  //gestion affichages sur pages fundingTypeRefs display list/form
  public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
    private fundingTypeR: FundingTypeRepository,
    private fundingTypeFormS: FundingTypeFormService,
    private fundingTypeRefS: FundingTypeRefService,
  ) { 
    this.fundingTypeRef = this.fundingTypeRefS.fundingTypeRef.getValue();
    this.initForm();
    this.setObservables();
  }

  private get initialValues(): FundingType {
    return {};
  }

  initForm(): void {
    this.form = this.fundingTypeFormS.createForm(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    //patch le form par les valeurs par defaut si creation
    this.fundingType.asObservable()
      .pipe(
        tap(() => this.reset()),
        filter((fundingType: FundingType)=>fundingType !== null),
        map((fundingType: FundingType): any => {
          // fundingType.fonction = fundingType.fonction ? fundingType.fonction['@id'] : null; 
          // fundingType.antenne = fundingType.antenne ? fundingType.antenne['@id'] : null; 
          return fundingType;
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });
  }

  submit(): Observable<FundingType> {   
    this.waiting = true;
    let api;
    if (this.fundingType.getValue()) {
      //update
      api = this.fundingTypeR.patch((this.fundingType.getValue())['@id'], this.form.value);
    } else {
      //create
      const value = Object.assign({fundingTypeRef: this.fundingTypeRef['@id']}, this.form.value);
      api = this.fundingTypeR.createFundingType(value)
              .pipe(
                tap((fundingType: FundingType) => console.log(fundingType)),
              );
    }

    return api
      .pipe(
        tap((): void => {
          this.waiting = false;
          this.reset();
        })
      );   
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
  }

  reset() {
    this.form.reset(this.initialValues);
  }
}