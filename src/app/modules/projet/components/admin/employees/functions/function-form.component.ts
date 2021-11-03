import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { FunctionService } from './function.service';

@Component({
  selector: 'app-projet-employee-function-form',
  templateUrl: './function-form.component.html'
})
export class FunctionFormComponent implements OnInit {

	public form: FormGroup;
  isEdit(): boolean {
    return this.functionS.eFunction.getValue() !== null;
  }

  constructor(
  	private functionS: FunctionService
  ) { }

  ngOnInit() {
  	this.form = this.functionS.form;
  }

  save() {
  	this.functionS.submit();
  }

  cancel() {
    if (this.functionS.eFunction.getValue()) {
      this.functionS.eFunctions.push(this.functionS.eFunction.getValue());
    }
    this.functionS.reset();
  }
}
