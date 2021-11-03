import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";


@Component({
  selector: 'app-projet-funding-type-form-template',
  templateUrl: './funding-type-form-template.component.html',
})
export class FundingTypeFormTemplateComponent {

	@Input() form: FormGroup;

  constructor() { }
}
