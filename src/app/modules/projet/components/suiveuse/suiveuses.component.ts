import { Component } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { SuiveuseService } from './suiveuse.service';
import { SuiveuseRepository } from '@projet/repository/suiveuse.repository';
import { TravelFormDialog } from './travels/travel-form/travel-form.dialog';
import { ExpenseFormDialog } from './expenses/expense-form/expense-form.dialog';
import { HolidayFormDialog } from './holidays/holiday-form/holiday-form.dialog';
import { WorkFormDialog } from './works/work-form/work-form.dialog';
import { AuthService } from '@shared/auth/authentication.service';

@Component({
  selector: 'app-projet-suiveuses',
  templateUrl: './suiveuses.component.html',
  styleUrls: ['./suiveuses.component.scss']
})
export class SuiveusesComponent {

	/* Date selectionnée sur le calendrier */
  get selectedDate() {
    return this.suiveuseS.selectedDate;
  }

  get user() { return this.authService.getUser().getValue(); }

  ELEMENTS: any = {
    'work': WorkFormDialog,
    'travel': TravelFormDialog,
    'expense': ExpenseFormDialog,
    'holiday': HolidayFormDialog,
  };

  get personForm(): FormControl { return this.suiveuseS.personForm };

  constructor(
    public dialog: MatDialog,
  	private suiveuseS: SuiveuseService,
    private suiveuseR: SuiveuseRepository,
    private authService: AuthService
  ) { 
    this.suiveuseR.calculateRecup()
      .subscribe(res => {return;});
  }

  addElement(element: 'work'|'travel'|'expense'|'holiday') {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      [element]: null,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-95';

    const dialogRef = this.dialog.open(this.ELEMENTS[element], dialogConfig);
  }
}
