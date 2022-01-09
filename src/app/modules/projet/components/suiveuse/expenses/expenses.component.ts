import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import { SuiveuseService } from '../suiveuse.service';
import { ExpenseFormService } from './expense-form/expense-form.service';
import { ExpenseFormDialog } from './expense-form/expense-form.dialog';
import { Expense } from '../../../repository/project.interface';
import { ApiProjectRepository } from '../../../repository/api-project.repository';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GlobalsService } from '../../../../../shared/services/globals.service';

@Component({
  selector: 'app-project-worktime-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {

  _expenses: Expense[] = [];
  @Input() set expenses(value){ this._expenses = value };
  get expenses(){ return this._expenses.sort((a, b) => 
                              (this.orderBy.field !== 'expenseDate' ? (a.expenseDate > b.expenseDate) : (a.study.label > b.study.label)) 
                                  ? 1 : -1) };
  @Input() orderBy: any;

  constructor(
    private suiveuseS: SuiveuseService,
    private expenseFormS: ExpenseFormService,
    public dialog: MatDialog,
    public apiR: ApiProjectRepository,
    private globalS: GlobalsService,
  ) { }

  ngOnInit() {
  }

  edit(expense) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      expense: expense,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ExpenseFormDialog, dialogConfig);
  }

  delete(expense) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression du frais ${expense.provider} pour ${expense.study.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.apiR.delete(expense['@id'])
          .pipe(
            // tap(() => this.expensesS.refreshWorks(this.selectedDate.getValue())),
            // tap(() => this.suiveuseS.refreshDayData(work.workingDate)),
          )
          .subscribe(() => this.globalS.snackBar({msg: "Frais supprimé"}));
      }
    }); 
  }

  displayDuration(duration: number): string {
    const hour = Math.floor(duration/60);
    const minute = (duration % 60) < 10 ? `0${duration % 60}` : duration % 60;
    return `${hour}h${minute}`;
  }
}
