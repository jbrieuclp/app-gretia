import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { filter, switchMap, map, tap } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ProjetRepository, Projet } from '../../../../repository/projet.repository'
import { Task } from '../../../../repository/task.repository';
import { ProjetTasksService } from './tasks.service';
import { TaskService } from './task/task.service';
import { TaskFormDialog } from './task/form/task-form.dialog';

@Component({
  selector: 'app-projets-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TasksComponent implements OnInit, OnDestroy {

	public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
	public displayedColumns: string[] = ['intitule', 'nbJours', 'numberDaysDone', 'charge', 'removable'];
  
  get tasks(): Task[] { return this.projetTasksS.tasks.getValue(); }
	get loading(): boolean { return this.projetTasksS.loading; }

  get selectedTask(): Task | null { return this.taskS.task.getValue(); };
  get displayForm(): boolean { return this.taskS.displayTaskForm; };
  set displayForm(value: boolean) { this.taskS.displayTaskForm = value; };
  _subscription: Subscription;
  expandRow: boolean = false;

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
  	private projetR: ProjetRepository,
    private projetTasksS: ProjetTasksService,
    private taskS: TaskService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this._subscription = this.projetTasksS.tasks.asObservable()
      .subscribe((tasks: Task[]) => {
        this.dataSource.data = tasks
        this.dataSource.sort = this.sort;
      })
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

  selectTask(task) {
    if (task === this.taskS.task.getValue()) {
      this.expandRow = !this.expandRow;
    } else {
      this.taskS.task.next(task);
      this.expandRow = true;
    }
  }

  openTaskForm(task: Task = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(TaskFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: boolean) => res)
      )
      .subscribe((val) => {}/*this.projetS.refreshCharges()*/);
  }

  deleteTask(task) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la tâche "${task.intitule}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.projetR.delete(task['@id'])
          .pipe(
            tap(() => this.taskS.task.next(null)),
            // tap(() => this.projetS.snackBar("Tâche supprimée avec succès")),
          )
          .subscribe(() => this.projetTasksS.refresh());
      }
    }); 
  }
}
