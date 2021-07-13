import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Antenne } from '../../../../repository/salarie.repository'
import { AntenneService } from './antenne.service'

@Component({
  selector: 'app-projet-admin-antennes',
  templateUrl: './antennes.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class AntennesComponent implements OnInit {

	get antennes(): Antenne[] {
    return this.antenneS.antennes;
  }
  @ViewChild('stepper') private stepper: MatStepper;

  constructor(
  	private antenneS: AntenneService,
  ) { }

  ngOnInit() {
    this.antenneS.stepper = this.stepper;
  }

  selected(antenne) {
    this.antenneS.antenne.next(antenne);
  }

  create() {
    this.antenneS.antenne.next(null);
    this.antenneS.moveStepper(1);
  }

  edit() {
    this.antenneS.moveStepper(1);
  }
}
