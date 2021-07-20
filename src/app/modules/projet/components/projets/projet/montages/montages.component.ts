import { Component, OnInit, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription, combineLatest } from 'rxjs';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { ProjetRepository, Projet, Charge } from '../../../../repository/projet.repository';
import { Task } from '../../../../repository/task.repository';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ChargeFormDialog } from './charge-form.dialog';
import { ProjetMontagesService } from './montages.service';
import { ProjetTasksService } from '../tasks/tasks.service';

@Component({
  selector: 'app-projet-projet-montages',
  templateUrl: './montages.component.html',
  styleUrls: ['./montages.component.scss']
})
export class MontagesProjectComponent implements OnInit, OnDestroy {

  // get unfinancedActions(): Task[] {
  //   return this.projetS.tasks.getValue().filter(t => t.charge === null);
  // }
  // get actionCharges(): Charge[] {
  //   return this.charges.filter(c => c.chargeType.chargeTypeRef.isPerDay === true);
  // }

	totalItems: number = 0;
	displayForm: boolean = false;
  _subscriptions: Subscription[] = [];
  associateChargeForm: FormControl = new FormControl(null, [Validators.required]);

  @ViewChild('actionsList', { static: false }) actionsList: MatSelectionList;

  charges: Charge[] = [];
	get totals(): number {
    return this.charges.map(item => item.quantity * item.unitCostApplied).reduce((prev, next) => prev + next, 0);
  };

  get totalsUsed(): number {
    return this.charges.map(item => (item.quantity-item.quantityUsed) * item.unitCostApplied).reduce((prev, next) => prev + next, 0);
  };

  get loading(): boolean {
    return this.projetMontagesS.loading;
  }

  get loadingUsed(): boolean { return this.projetMontagesS.loading || this.projetTasksS.loading }

  constructor(
  	private projetMontagesS: ProjetMontagesService,
    private projetTasksS: ProjetTasksService,
  	private projetR: ProjetRepository,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    //calcul du temps consommé
    this._subscriptions.push(
      combineLatest(
        this.projetMontagesS.charges.asObservable(),
        this.projetTasksS.tasks.asObservable()
      )
        .pipe(
          map(([charges, tasks])=>{
            return charges.map(charge => {
              charge.quantityUsed = 0;
              tasks.forEach(task => {
                if (task.charge && task.charge['@id'] === charge['@id']) {
                  charge.quantityUsed += task.numberDaysDone;
                }
              });
              return charge;
            });
          })
        )
      .subscribe((charges) => this.charges = charges)
    );
  }

  openFormMontage(charge = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      'charge': charge
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
      .subscribe((charges: Charge[]) => this.projetMontagesS.charges.next(charges));
  }

  delete(charge: Charge) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la ligne "${charge.label}" du montage ?`
    });
    dialogRef.afterClosed()
      .pipe(
        filter(close => close),
        switchMap(() => this.projetR.deleteCharge(charge.id)),
        map(()=>{
          const index = this.charges.findIndex(e=>e['@id'] === charge['@id']);
          if (index > -1) {
            this.charges.splice(index, 1);
          }
          return this.charges;
        })
      )
      .subscribe((charges: Charge[]) => this.projetMontagesS.charges.next(charges)); 
  }

  // associateChargeTasks() {
  //   const associateCharge = this.associateChargeForm.value;
  //   this.actionsList.selectedOptions.selected.forEach(e => {
  //     this.projetR.patch(e.value, {'charge': associateCharge})
  //       .subscribe(() => {return ;} );
  //   })
  //   this.projetS.refreshTasks();
  // }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

}