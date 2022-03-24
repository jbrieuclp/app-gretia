import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray } from "@angular/forms";

import { PersonService } from './person.service';

@Component({
  selector: 'app-projet-person-form',
  templateUrl: './person-form.component.html'
})
export class PersonFormComponent implements OnInit {

	public form: FormGroup;
  isEdit(): boolean {
    return this.personS.person.getValue() !== null;
  }

  constructor(
  	private personS: PersonService
  ) { }

  ngOnInit() {
  	this.form = this.personS.form;
  }

  save() {
  	this.personS.submit();
  }

  cancel() {
    this.personS.reset();
    this.personS.moveStepper(0);
  }

  get employeeControls() {
    return (this.form.get("employees") as FormArray)
      .controls;
  }
}
