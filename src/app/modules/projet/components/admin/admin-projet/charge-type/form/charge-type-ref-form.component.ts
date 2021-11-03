import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from "@angular/forms";

import { ChargeTypeRefService } from '../charge-type-ref.service';

@Component({
  selector: 'app-projet-charge-type-ref-form',
  templateUrl: './charge-type-ref-form.component.html',
  styleUrls: ['./charge-type-ref-form.component.scss']
})
export class ChargeTypeRefFormComponent implements OnInit {

	public form: FormGroup;

  constructor(
  	private chargeTypeRefS: ChargeTypeRefService
  ) { }

  ngOnInit() {
  	this.form = this.chargeTypeRefS.form;
  }

  save() {
  	this.chargeTypeRefS.submit();
  }

  cancel() {
    this.chargeTypeRefS.reset();
    this.chargeTypeRefS.moveStepper(0);
  }

  get chargeTypesControls() {
    return (this.form.get("chargeTypes") as FormArray)
      .controls;
  }

  console() {
    console.log(this.form)
  }
}
