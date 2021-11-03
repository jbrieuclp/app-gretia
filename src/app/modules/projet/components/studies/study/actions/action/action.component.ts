import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

import { ActionService } from './action.service';
import { Action } from '../../../../../repository/project.interface';
import { ActionFormDialog } from '../action/form/action-form.dialog';

@Component({
  selector: 'app-projet-study-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent implements OnInit {

  get action() { return this.actionS.action; }
  
  get loading() { return this.actionS.loading; }

  constructor(
    private actionS: ActionService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
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
      .subscribe((actions) => {console.log(this.action)}/*this.projetS.refreshCharges()*/);
  }

}
