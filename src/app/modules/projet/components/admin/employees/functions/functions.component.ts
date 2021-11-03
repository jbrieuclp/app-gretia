import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Function } from '../../../../repository/project.interface'
import { FunctionService } from './function.service'

@Component({
  selector: 'app-projet-admin-functions',
  templateUrl: './functions.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class FunctionsComponent implements OnInit {

	get functions(): Function[] { return this.functionS.eFunctions; }
  get loadingList(): boolean { return this.functionS.loadingList; }
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  constructor(
  	private functionS: FunctionService,
  ) { }

  ngOnInit() {
    this.functionS.stepper = this.stepper;
  }

  selected(eFunction) {
    this.functionS.eFunction.next(eFunction);
  }

  create() {
    this.functionS.eFunction.next(null);
    this.functionS.moveStepper(1);
  }

  edit() {
    this.functionS.moveStepper(1);
  }
}
