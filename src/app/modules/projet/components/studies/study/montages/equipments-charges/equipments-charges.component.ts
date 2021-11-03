import { Component, OnInit } from '@angular/core';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import { StudyMontagesService } from '../montages.service';
import { ChargeFormDialog } from '../charge-form.dialog';
import { Action, Study, Charge } from '../../../../../repository/project.interface';

@Component({
  selector: 'app-project-study-equipments-charges',
  templateUrl: './equipments-charges.component.html',
  styleUrls: ['./equipments-charges.component.scss']
})
export class StudyEquipmentsChargesComponent implements OnInit {

  get charges() {
    return this.studyMontagesS.charges.getValue()
      .filter(e => e.chargeType.chargeTypeRef.isPerDay === false);
  }

  get totals(): number {
    return this.charges.map(item => item.quantity * item.unitCostApplied).reduce((prev, next) => prev + next, 0);
  }

  get loading(): boolean { return this.studyMontagesS.loading; }

  constructor(
    public dialog: MatDialog,
    private studyMontagesS: StudyMontagesService,
  ) { }

  ngOnInit() {
  }

  openFormMontage(charge = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      'charge': charge,
      'formParam': {'isPerDay': false}
    };

    const dialogRef = this.dialog.open(ChargeFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: any) => res !== false),
        map((charge: Charge)=>{
          const idx = this.charges.findIndex(c=>c['@id'] === charge['@id'])
          if ( idx === -1) {
            this.charges.push(charge);
          } else {
            this.charges[idx] = charge;
          }
          return this.charges;
        })
      )
      .subscribe((charges: Charge[]) => this.studyMontagesS.charges.next(charges));
  }

}
