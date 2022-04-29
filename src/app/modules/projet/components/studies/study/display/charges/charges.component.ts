import { Component, OnInit } from '@angular/core';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { StudyChargesService } from './charges.service';
import { StudyService } from '../../study.service';
import { ChargeFormDialog } from './form/charge-form.dialog';
import { Action, Study, Charge } from '@projet/repository/project.interface';
import { ApiProjectRepository } from '@projet/repository/api-project.repository';

@Component({
  selector: 'app-project-study-charges',
  templateUrl: './charges.component.html',
  styleUrls: ['./charges.component.scss']
})
export class StudyChargesComponent implements OnInit {

  get charges() { return this.studyChargesS.charges.getValue(); }

  get totals(): number {
    return this.charges.map(item => item.quantity * item.unitCostApplied).reduce((prev, next) => prev + next, 0);
  }

  get loading(): boolean { return !(!this.studyChargesS.loading && !this.studyS.loadingStudy); }; //chargement du study


  constructor(
    public dialog: MatDialog,
    private studyChargesS: StudyChargesService,
    private studyS: StudyService,
    private apiR: ApiProjectRepository,
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
      .subscribe(() => {return;});
  }

  delete(charge: Charge) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la charge "${charge.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.apiR.delete(charge['@id'])
          .pipe(
            tap(() => {
              const idx = this.charges.findIndex(e => e === charge);
              if ( idx !== -1) {
                this.charges.splice(idx, 1);
              }
            }),
            // tap(() => this.projetS.snackBar("Tâche supprimée avec succès")),
          )
          .subscribe(() => {return;});
      }
    })
  }

}
