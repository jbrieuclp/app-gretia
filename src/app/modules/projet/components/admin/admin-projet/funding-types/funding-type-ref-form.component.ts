import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from "@angular/forms";

import { FundingTypeRefService } from './funding-type-ref.service';

@Component({
  selector: 'app-projet-admin-funding-type-ref-form',
  templateUrl: './funding-type-ref-form.component.html',
})
export class FundingTypeRefFormComponent implements OnInit {

	public form: FormGroup;
  isEdit(): boolean {
    return this.fundingTypeRefS.fundingTypeRef.getValue() !== null;
  }

  constructor(
  	private fundingTypeRefS: FundingTypeRefService
  ) { }

  ngOnInit() {
  	this.form = this.fundingTypeRefS.form;
  }

  save() {
  	this.fundingTypeRefS.submit();
  }

  cancel() {
    this.fundingTypeRefS.reset();
    this.fundingTypeRefS.moveStepper(0);
  }

  get projectTypesControls() {
    return (this.form.get("projectTypes") as FormArray)
      .controls;
  }

}
