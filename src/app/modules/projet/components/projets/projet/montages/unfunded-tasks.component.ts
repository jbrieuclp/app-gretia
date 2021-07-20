import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormControl, Validators } from "@angular/forms";
import { filter, switchMap, map, tap } from 'rxjs/operators';

import { ProjetTasksService } from '../tasks/tasks.service';
import { ProjetMontagesService } from './montages.service';
import { ProjetService } from '../projet.service';
import { TaskRepository, Task } from '../../../../repository/task.repository';
import { Charge } from '../../../../repository/projet.repository';

@Component({
  selector: 'app-projet-projet-unfunded-tasks',
  templateUrl: './unfunded-tasks.component.html',
  styleUrls: ['./unfunded-tasks.component.scss']
})
export class UnfundedTasksComponent implements OnInit {

  get projet() { return this.projetS.projet.getValue(); }

  get tasks() { return this.projetTasksS.tasks.getValue(); }

  get unfundedTasks() { return (this.projetTasksS.tasks.getValue()).filter(t => t.charge === null); }

  constructor(
    private projetTasksS: ProjetTasksService,
    private projetS: ProjetService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  funder(task) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '450px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      'task': task
    };

    const dialogRef = this.dialog.open(TaskFunderDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: any) => res !== false),
        // map((task: Task)=>{
        //   const idx = this.charges.findIndex(c=>c['@id'] === charge['@id'])
        //   if ( idx === -1) {
        //     this.charges.push(charge);
        //   } else {
        //     this.charges[idx] = charge;
        //   }
        //   return this.charges;
        // })
      )
      .subscribe((tasks: Task[]) => true/*this.projetMontagesS.charges.next(charges)*/);
  }

}



@Component({
  selector: 'app-projet-projet-funder-task-dialog',
  templateUrl: './task-funder.dialog.html',
})
export class TaskFunderDialog implements OnInit {

  task: Task = null;
  chargeControl: FormControl = new FormControl('', [Validators.required]);
  charges: Charge[] = [];
  waiting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<TaskFunderDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projetS: ProjetService,
    private projetMontagesS: ProjetMontagesService,
    private taskR: TaskRepository,
  ) {
    this.task = data.task;
  }

  ngOnInit() {
    this.projetMontagesS.charges.asObservable()
      .pipe(
        map((charges: Charge[]) => charges.filter(c => c.chargeType.chargeTypeRef.isPerDay))
      )
      .subscribe(charges => this.charges = charges);
  }

  submit() {
    this.waiting = true;
    this.taskR
      .patch(
        this.task['@id'], 
        {charge: this.chargeControl.value}
      )
      .pipe(
        tap(()=>this.waiting = false)
      )
      .subscribe((val) => console.log(val));
  }

  cancel() {
    this.dialogRef.close(false);
  }
}