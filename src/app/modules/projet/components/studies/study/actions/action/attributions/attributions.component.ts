import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { tap, map, filter, switchMap } from 'rxjs/operators';

import { ActionsRepository } from '../../../../../../repository/actions.repository';
import { Action, ActionAttribution } from '../../../../../../repository/project.interface';
import { ActionAttributionFormDialog } from './attribution-form/attribution-form.dialog';
import { ConfirmationDialogComponent } from '../../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActionService } from '../action.service';

@Component({
  selector: 'app-projet-study-action-attributions',
  templateUrl: './attributions.component.html',
  styleUrls: ['./attributions.component.scss']
})
export class ActionAttributionsComponent implements OnInit {

  get action(): Action { return this.actionS.action.getValue(); }

  loading: boolean = false;

  constructor(
  	private actionR: ActionsRepository,
    private actionS: ActionService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  }

  getAttributions(id): Observable<ActionAttribution[]> {
    this.loading = true;
  	return this.actionR.attributions(id)
  		.pipe(
        tap(() => this.loading = false),
        map((data: any): ActionAttribution[]=>data["hydra:member"])
      );
  }

  openActionForm(attribution: ActionAttribution = null) {

    if (attribution === null) {
      attribution = {action: this.action['@id']};
    }

    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      'attribution': attribution
    };

    const dialogRef = this.dialog.open(ActionAttributionFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: boolean) => res),
        switchMap(() => this.getAttributions(this.action.id))
      )
      .subscribe((attributions: ActionAttribution[]) => this.action.attributions = attributions);
  }

  delete(attribution: ActionAttribution) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de l'attribution des heures pour "${attribution.employee.person.name} ${attribution.employee.person.firstname}" ?`
    });
    dialogRef.afterClosed()
      .pipe(
        filter(close => close),
        switchMap(() => this.actionR.delete(attribution['@id'])),
        switchMap(() => this.getAttributions(this.action.id))
      )
      .subscribe((attributions: ActionAttribution[]) => this.action.attributions = attributions);
  }

}
