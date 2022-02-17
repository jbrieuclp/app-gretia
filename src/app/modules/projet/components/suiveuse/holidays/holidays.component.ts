import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import { SuiveuseService } from '../suiveuse.service';
import { HolidayFormService } from './holiday-form/holiday-form.service';
import { HolidayFormDialog } from './holiday-form/holiday-form.dialog';
import { Holiday } from '@projet/repository/project.interface';
import { ApiProjectRepository } from '@projet/repository/api-project.repository';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { GlobalsService } from '@shared/services/globals.service';

@Component({
  selector: 'app-project-worktime-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.scss']
})
export class HolidaysComponent implements OnInit {

  _holidays: Holiday[] = [];
  @Input() set holidays(holidays){ this._holidays = holidays };
  get holidays(){ return this._holidays.sort((a, b) => a.holidayDate > b.holidayDate ? 1 : -1) };
  @Input() orderBy: any;

  constructor(
    private suiveuseS: SuiveuseService,
    private holidayFormS: HolidayFormService,
    public dialog: MatDialog,
    public apiR: ApiProjectRepository,
    private globalS: GlobalsService,
  ) { }

  ngOnInit() {
  }

  edit(holiday) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      holiday: holiday,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-95';

    const dialogRef = this.dialog.open(HolidayFormDialog, dialogConfig);
  }

  delete(holiday) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression du jour de congé du ${holiday.holidayDate} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.apiR.delete(holiday['@id'])
          .pipe(
            // tap(() => this.holidaysS.refreshWorks(this.selectedDate.getValue())),
            // tap(() => this.suiveuseS.refreshDayData(work.workingDate)),
          )
          .subscribe(() => this.globalS.snackBar({msg: "Congé supprimé"}));
      }
    }); 
  }
}
