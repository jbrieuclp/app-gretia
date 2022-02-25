import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';

import { AuthService } from '@shared/auth/authentication.service';
import { PlansChargesService } from '../plans-charges.service';
import { SchedulEditorDialog } from './schedul-editor/schedul-editor.dialog';

@Component({
  selector: 'app-projet-plans-prov-schedule',
  templateUrl: './prov-schedule.component.html',
  styleUrls: ['./prov-schedule.component.scss']
})
export class ProvScheduleComponent implements OnInit {

  get user() { return this.authService.getUser().getValue(); };
  get selectedPerson() { return this.plansChargesS.person; };

  constructor(
    private authService: AuthService,
    private plansChargesS: PlansChargesService, 
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  openPDCEditor() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '80%';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-95';

    const dialogRef = this.dialog.open(SchedulEditorDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: boolean) => res)
      )
      .subscribe((res) => {console.log(res)}/*this.projetS.refreshCharges()*/);
  }

}
