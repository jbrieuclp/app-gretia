import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { tap, filter, map } from 'rxjs/operators';

import { SuiveuseService } from '../suiveuse.service';
import { ExpenseFormService } from './expense-form/expense-form.service';
import { ExpenseFormDialog } from './expense-form/expense-form.dialog';
import { Expense } from '../../../repository/project.interface';
import { ApiProjectRepository } from '../../../repository/api-project.repository';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { SynoConnectionDialog } from '@synology/components/connect/dialog/connection.dialog';
import { GlobalsService } from '../../../../../shared/services/globals.service';
import { WorkingTimeResultsService } from '../result/results.service';
import { SynologyService } from '@synology/synology.service';
import { SynologyRepository } from '@synology/synology.repository';

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

  get isAuthUserData() { return this.suiveuseS.isAuthUserData };

  constructor(
    private suiveuseS: SuiveuseService,
    private expenseFormS: ExpenseFormService,
    public dialog: MatDialog,
    public apiR: ApiProjectRepository,
    private globalS: GlobalsService,
    private workingTimeResultsS: WorkingTimeResultsService,
    private synologyS: SynologyService,
    private synologyR: SynologyRepository,
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
    dialogConfig.panelClass = 'dialog-95';

    const dialogRef = this.dialog.open(ExpenseFormDialog, dialogConfig);
  }

  delete(expense) {
    if (expense.proofs.length && this.synologyS.sid === null) {
      const dialogRef = this.dialog.open(SynoConnectionDialog, {
        width: '550px',
      });

      dialogRef.afterClosed()
        .pipe(
          filter(result => result === true)
        )
        .subscribe(() => {
          this.deleteConfirmation(expense);
        });
    } else {
      this.deleteConfirmation(expense);
    }
  }

  deleteConfirmation(expense) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression du frais ${expense.provider} pour ${expense.study.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.apiR.delete(expense['@id'], {'sid': this.synologyS.sid})
          .pipe(
            tap(() => {
              this.workingTimeResultsS.removeExpenseFromResult(expense['@id']);
              this.suiveuseS.refreshDayData(expense.expenseDate)
            }),
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

  beforeDownload() {
    if (this.synologyS.sid === null) {
      const dialogRef = this.dialog.open(SynoConnectionDialog, {
        width: '550px',
      });

      return dialogRef.afterClosed()
        .pipe(
          map(result => result === true)
        )
        .toPromise();
    } else {
      return true;
    }
  }

  async downloadFile(proof) {
    if (await this.beforeDownload()) {
      this.synologyR.download(proof.filePath+'/'+proof.fileName)
        .subscribe((res: ArrayBuffer) => this.saveFile(res, proof.originalFileName),)
    }
  }

  private saveFile(blob, filename) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0)
  }
}
