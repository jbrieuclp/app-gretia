import { Component, OnInit, Inject } from '@angular/core';
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import { tap, map, startWith, distinctUntilChanged, filter } from 'rxjs/operators';
import _ from 'lodash';

import { GlobalsService } from '../../../../../../shared/services/globals.service';
import { Expense } from '../../../../repository/project.interface';
import { ExpenseFormService } from './expense-form.service';
import { WorksRepository } from '../../../../repository/works.repository';
import { SuiveuseService } from '../../suiveuse.service';
import { WorkingTimeResultsService } from '../../result/results.service';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-projet-expense-form',
  templateUrl: './expense-form.dialog.html',
  styleUrls: ['./expense-form.dialog.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', visibility: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class ExpenseFormDialog implements OnInit {

  form: FormGroup;
  get amountTTCForm(): FormControl { return this.expenseFormS.amountTTCForm; };
  get expense(): Expense { return this.expenseFormS.expense.getValue(); };
  HTForm_visibility: boolean = false;
  saving: boolean = false;

  get selectedDate() { return this.suiveuseS.selectedDate.getValue(); };

  constructor(
    public dialogRef: MatDialogRef<ExpenseFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private globalS: GlobalsService,
    private workR: WorksRepository,
    private expenseFormS: ExpenseFormService,
    private suiveuseS: SuiveuseService,
    private workingTimeResultsS: WorkingTimeResultsService,
  ) { 
    this.expenseFormS.expense.next(this.data.expense);
  }

  ngOnInit() {
    this.form = this.expenseFormS.form;

    this.amountTTCForm.enable();
  }

  sliderChange(sliderState) {
    this.HTForm_visibility = !this.HTForm_visibility;
    if (!sliderState) {
      this.amountTTCForm.enable();
      this.form.get('amountExclTax').setValidators([]);
      this.form.get('vat').setValidators([]);
    } else {
      this.amountTTCForm.disable();
      this.form.get('amountExclTax').setValidators([Validators.required]);
      this.form.get('vat').setValidators([Validators.required]);
    }
    this.form.updateValueAndValidity();
  }

  save() {
    this.saving = true;
    let data = Object.assign((this.expense !== null ? this.expense : {}), this.form.value);

    let api = (data['@id'] ? this.workR.patch(data['@id'], data) : this.workR.postMyExpenses(data));
    api.pipe(
      tap(() => this.saving = false),
      tap((expense) => {
        //update
        if (this.expense !== null) {
          Object.assign(this.expense, expense);
        } else {
          this.workingTimeResultsS.expenses.push(expense);
        }
      }),
      tap((expense) => this.suiveuseS.refreshDayData(expense.expenseDate)),
      tap(() => this.globalS.snackBar({msg: "Frais "+(data['@id'] ? 'modifié' : 'ajouté')})),
    )
    .subscribe(
      () => this.close(),
      err => this.saving = false
    );
  }

  close() {
    this.expenseFormS.reset();
    this.dialogRef.close();
  }

}
