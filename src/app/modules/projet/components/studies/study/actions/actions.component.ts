import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { StudiesRepository } from '../../../../repository/studies.repository'
import { Action, Study } from '../../../../repository/project.interface';
import { StudyActionsService } from './actions.service';
import { ActionService } from './action/action.service';
import { ActionFormDialog } from './action/form/action-form.dialog';

@Component({
  selector: 'app-projet-study-actions',
  templateUrl: './actions.component.html',
  styleUrls: ['./actions.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ActionsComponent implements OnInit, OnDestroy {
  
  get actions(): Action[] { return this.studyActionsS.actions.getValue(); }
	get loading(): boolean { return this.studyActionsS.loading; }

  actionGroups: any[] = [];

  actionsFromGroup(group): Action[] { 
    return this.actions
            .filter(elem => group['@id'] !== null ? (elem.charge !== null && elem.charge['@id'] === group['@id']) : elem.charge === null); 
  };

  get selectedId(): number { return this.actionS.action_id.getValue(); };

  _subscriptions: Subscription[] = [];

  constructor(
  	private projetR: StudiesRepository,
    private studyActionsS: StudyActionsService,
    private actionS: ActionService,
    public dialog: MatDialog,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this.route.queryParams
        .pipe(
          filter(params => params['item'] !== undefined),
          map((params: any): number => Number(params['item'])),
        )
        .subscribe((id) => this.actionS.action_id.next(id) )
    );

    this._subscriptions.push(
      this.studyActionsS.actions.asObservable()
        .pipe(
          tap(() => this.actionGroups = []),
          filter((actions: Action[]) => actions.length > 0),
          map((actions: Action[]): any[] => {
            return this.actions
                    .map(elem => elem.charge !== null ? elem.charge : {'@id': null, label: 'Actions hors montage'})
                    .filter((elem, index, self) => index === self.findIndex((t) => t['@id'] === elem['@id']));
          }),
        )
        .subscribe((groups: any[]) => this.actionGroups = groups )
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => {s.unsubscribe()});
  }

  selectAction(action) {
    this.location.go(`${this.router.url.split('?')[0]}?item=${action.id}`);
    this.actionS.action_id.next(action.id);
  }

  openActionForm(action: Action = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ActionFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: boolean) => res)
      )
      .subscribe((val) => {}/*this.projetS.refreshCharges()*/);
  }

  deleteAction(action: Action) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la tâche "${action.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.projetR.delete(action['@id'])
          .pipe(
            tap(() => this.actionS.action = null),
            // tap(() => this.projetS.snackBar("Tâche supprimée avec succès")),
          )
          .subscribe(() => this.studyActionsS.refresh());
      }
    }); 
  }
}
