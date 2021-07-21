import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { Fonction } from '../../../../repository/salarie.repository'
import { FonctionService } from './fonction.service'

@Component({
  selector: 'app-projet-admin-fonctions',
  templateUrl: './fonctions.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class FonctionsComponent implements OnInit {

	get fonctions(): Fonction[] { return this.fonctionS.fonctions; }
  get loadingList(): boolean { return this.fonctionS.loadingList; }
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  constructor(
  	private fonctionS: FonctionService,
  ) { }

  ngOnInit() {
    this.fonctionS.stepper = this.stepper;
  }

  selected(fonction) {
    this.fonctionS.fonction.next(fonction);
  }

  create() {
    this.fonctionS.fonction.next(null);
    this.fonctionS.moveStepper(1);
  }

  edit() {
    this.fonctionS.moveStepper(1);
  }
}
