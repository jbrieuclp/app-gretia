import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ChargeTypeRef } from '../../../../repository/project.interface'
import { ChargeTypeRefService } from './charge-type-ref.service'


@Component({
  selector: 'app-projet-admin-charge-types',
  templateUrl: './charge-types.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class ChargeTypesComponent implements OnInit {

  get chargeTypeRefs(): ChargeTypeRef[] {
    return this.chargeTypeRefS.chargeTypeRefs;
  }

  get chargeTypeRefSelect(): ChargeTypeRef {
    return this.chargeTypeRefS.chargeTypeRefSelect.getValue();
  }

  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  constructor(
  	private chargeTypeRefS: ChargeTypeRefService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.chargeTypeRefS.stepper = this.stepper;
  }

  select(chargeTypeRef: ChargeTypeRef) {
    this.chargeTypeRefS.moveStepper(0);
    this.chargeTypeRefS.chargeTypeRefSelect.next(chargeTypeRef);
  }

  addChargeTypeRef() {
    this.chargeTypeRefS.chargeTypeRefSelect.next(null);
    this.chargeTypeRefS.moveStepper(1);
  }

}
