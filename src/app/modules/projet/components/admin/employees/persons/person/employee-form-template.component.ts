import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { FunctionService } from '../../functions/function.service';
import { AntenneService } from '../../antennes/antenne.service';
import { Function, Antenne } from '../../../../../repository/project.interface';

@Component({
  selector: 'app-projet-person-employee-form-template',
  templateUrl: './employee-form-template.component.html',
})
export class EmployeeFormTemplateComponent {

	get functions(): Function[] { return this.functionS.eFunctions; }
  get antennes(): Antenne[] { return this.antenneS.antennes; }

	@Input() form: FormGroup;

  constructor(
  	private functionS: FunctionService,
    private antenneS: AntenneService,
  ) { }
}
