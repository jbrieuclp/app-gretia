import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription, combineLatest, Observable } from 'rxjs';
import { filter, switchMap, map, tap } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { StudiesRepository } from '@projet/repository/studies.repository'
import { Action, Study, Objective } from '@projet/repository/project.interface';
import { StudyActionsService } from './actions.service';
import { ActionService } from './action/action.service';
import { ActionFormDialog } from './action/form/action-form.dialog';
import { ActionObjectiveFormDialog } from './action/objective/objective-form.dialog';
import { ActionObjectiveAssignmentDialog } from './action/objective/objective-assignment.dialog';

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
  get objectives(): Objective[] { return this.studyActionsS.objectives.getValue(); }
	get loading(): boolean { return this.studyActionsS.loading; }

  get selectedAction(): Action { return this.actionS.action.getValue(); };

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
      combineLatest(
        this.route.queryParams
          .pipe(
            filter(params => params['item'] !== undefined),
            map((params: any): number => Number(params['item'])),
          ),
        this.studyActionsS.actions.asObservable()
      )
        .pipe(
          map(([id, actions]: [number, Action[]]): Action => actions.find(e => e.id === id)),
          filter(action => action !== undefined),
        )
        .subscribe((action) => this.actionS.action.next(action))
    );
  }

  getObjectivesActions(objective: Objective): Action[] {
    return this.actions.filter(e => e.objective === (objective ? objective['@id'] : null));
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => {s.unsubscribe()});
  }

  selectAction(action) {
    this.location.go(`${this.router.url.split('?')[0]}?item=${action.id}`);
    this.actionS.action.next(action);
  }

  assignObjective(action) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {action: action};
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ActionObjectiveAssignmentDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: boolean) => res)
      )
      .subscribe((val) => {}/*this.projetS.refreshCharges()*/);
  }

  createAction() {
    this.actionS.action.next(null);
    this.openActionForm();
  }

  openActionForm() {
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

  openObjectiveForm() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ActionObjectiveFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: boolean) => res)
      )
      .subscribe((val) => {}/*this.projetS.refreshCharges()*/);
  }

  delete(action: Action) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la tâche "${action.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.projetR.delete(action['@id'])
          .pipe(
            tap(() => {
              const idx = this.actions.findIndex(e => e === action);
              if ( idx !== -1) {
                this.actions.splice(idx, 1);
              }
            }),
            // tap(() => this.projetS.snackBar("Tâche supprimée avec succès")),
          )
          .subscribe(() => this.actionS.action.next(null));
      }
    }); 
  }
}
