import { Component, OnInit, Inject, OnDestroy, ViewChild, Input } from '@angular/core';
import { MatSelectionList } from '@angular/material/list'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, switchMap, map, tap } from 'rxjs/operators';

import { StudiesRepository } from '../../../../../repository/studies.repository';
import { Action, Study, Charge } from '../../../../../repository/project.interface';

import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ChargeFormDialog } from '../charge-form.dialog';
import { StudyMontagesService } from '../montages.service';
import { StudyActionsService } from '../../actions/actions.service';

@Component({
  selector: 'app-projet-study-actions-charges',
  templateUrl: './actions-charges.component.html',
  styleUrls: ['./actions-charges.component.scss']
})
export class ActionsChargesStudyComponent implements OnInit, OnDestroy {

  // get unfinancedActions(): Action[] {
  //   return this.studyS.actions.getValue().filter(t => t.charge === null);
  // }
  // get actionCharges(): Charge[] {
  //   return this.charges.filter(c => c.chargeType.chargeTypeRef.isPerDay === true);
  // }
  @Input() autofunding: boolean = false;
	totalItems: number = 0;
	displayForm: boolean = false;
  _subscriptions: Subscription[] = [];
  associateChargeForm: FormControl = new FormControl(null, [Validators.required]);

  @ViewChild('actionsList', { static: false }) actionsList: MatSelectionList;

  _charges: Charge[] = [];

  get charges() {
    return this._charges.filter(item => item.autofunding === this.autofunding);
  }

	get totals(): number {
    return this.charges.map(item => item.quantity * item.unitCostApplied).reduce((prev, next) => prev + next, 0);
  };

  get totalsUsed(): number {
    return this.charges.map(item => (item.quantity-item.quantityUsed) * item.unitCostApplied).reduce((prev, next) => prev + next, 0);
  };

  get loading(): boolean {
    return this.studyMontagesS.loading;
  }

  get loadingUsed(): boolean { return this.studyMontagesS.loading || this.studyActionsS.loading }

  constructor(
  	private studyMontagesS: StudyMontagesService,
    private studyActionsS: StudyActionsService,
  	private studyR: StudiesRepository,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    //calcul du temps consommé
    this._subscriptions.push(
      combineLatest(
        this.studyMontagesS.charges.asObservable(),
        this.studyActionsS.actions.asObservable()
      )
        .pipe(
          map(([charges, actions])=>{
            return charges.map(charge => {
              charge.quantityUsed = 0;
              actions.forEach(action => {
                if (action.charge && action.charge['@id'] === charge['@id']) {
                  charge.quantityUsed += action.numberDaysDone;
                }
              });
              return charge;
            }).filter(e => e.chargeType.chargeTypeRef.isPerDay === true);
          }),
          tap((charges) => {
            this.studyMontagesS.actionsRealCost.next(
              charges.map(item => item.quantityUsed * item.unitCostApplied).reduce((prev, next) => prev + next, 0)
            )
          })
        )
      .subscribe((charges) => this._charges = charges)
    );
  }

  openFormMontage(charge = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      'charge': charge,
      'formParam': {'isPerDay': true}
    };

    const dialogRef = this.dialog.open(ChargeFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: any) => res !== false),
        map((charge: Charge)=>{
          let charges = this.studyMontagesS.charges.getValue();
          const idx = charges.findIndex(c=>c['@id'] === charge['@id'])
          if ( idx === -1) {
            charges.push(charge);
          } else {
            charges[idx] = charge;
          }
          return charges;
        })
      )
      .subscribe((charges: Charge[]) => this.studyMontagesS.charges.next(charges));
  }

  delete(charge: Charge) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la ligne "${charge.label}" du montage ?`
    });
    dialogRef.afterClosed()
      .pipe(
        filter(close => close),
        switchMap(() => this.studyR.deleteCharge(charge.id)),
        map(()=>{
          const index = this.charges.findIndex(e=>e['@id'] === charge['@id']);
          if (index > -1) {
            this.charges.splice(index, 1);
          }
          return this.charges;
        })
      )
      .subscribe((charges: Charge[]) => this.studyMontagesS.charges.next(charges)); 
  }

  // associateChargeActions() {
  //   const associateCharge = this.associateChargeForm.value;
  //   this.actionsList.selectedOptions.selected.forEach(e => {
  //     this.studyR.patch(e.value, {'charge': associateCharge})
  //       .subscribe(() => {return ;} );
  //   })
  //   this.studyS.refreshActions();
  // }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

}