import { Component, OnInit, Inject } from '@angular/core';
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import { tap, map, startWith, distinctUntilChanged, filter } from 'rxjs/operators';
import _ from 'lodash';

import { Expense } from '../../../../../repository/project.interface';
import { ExpenseFormService } from './expense-form.service';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-projet-work-expense-form',
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
export class WorkExpenseFormDialog implements OnInit {

  form: FormGroup;
  amountTTCForm: FormControl = new FormControl([0]);
  expense: Expense = {};
  HTForm_visibility: boolean = true;
  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<WorkExpenseFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private expenseFormS: ExpenseFormService,
  ) { }

  private get initialValues(): any {
    const values = {
            amountExclTax: 0,
            vat: 0,
            amountInclTax: 0,
          };
    return values;
  }

  ngOnInit() {
    this.form = this.expenseFormS.form;

    this.amountTTCForm.disable();

    this.form.patchValue(_.isEmpty(this.expense) ? this.initialValues : this.expense);

    this.subscriptions.push(
      combineLatest(
        this.form.get('amountExclTax').valueChanges
          .pipe(
            startWith(0),
            distinctUntilChanged(),
            filter((val) => val !== null)
          ),
        this.form.get('vat').valueChanges
          .pipe(
            startWith(0),
            distinctUntilChanged(),
            filter((val) => val !== null)
          )
      )
        .pipe(
          map(([amountExclTax, vat]: [number, number]): number => amountExclTax + vat),
          tap((value: number) => this.form.get('amountInclTax').setValue(value))
        )
        .subscribe((value: number) => this.amountTTCForm.setValue(value, {emitEvent: false}))
    );

    this.subscriptions.push(
      this.amountTTCForm.valueChanges
        .pipe(
          tap((val) => {
            this.form.get('amountExclTax').setValue(null, {emitEvent: false});
            this.form.get('vat').setValue(null, {emitEvent: false});
          })
        )
        .subscribe((value: number) => this.form.get('amountInclTax').setValue(value))
    );
  }

  sliderChange(sliderState) {
    this.HTForm_visibility = !this.HTForm_visibility;
    if (sliderState) {
      this.amountTTCForm.enable();
      this.form.get('amountExclTax').setValidators([]);
      this.form.get('vat').setValidators([]);
    } else {
      this.amountTTCForm.disable();
      this.form.get('amountExclTax').setValidators([Validators.required]);
      this.form.get('vat').setValidators([Validators.required]);
    }
  }

  add() {
    if (this.form.valid) {
      this.dialogRef.close(Object.assign(this.expense, this.form.value));
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

}
