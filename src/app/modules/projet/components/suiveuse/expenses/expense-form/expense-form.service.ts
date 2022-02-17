import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { BehaviorSubject, combineLatest } from "rxjs";
import { tap, map, startWith, distinctUntilChanged, filter } from "rxjs/operators";
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../../suiveuse.service';
import { Expense, ExpenseProof } from '../../../../repository/project.interface';

@Injectable()
export class ExpenseFormService {

  public form: FormGroup;
  public amountTTCForm: FormControl;
  expense: BehaviorSubject<Expense> = new BehaviorSubject(null);
  proofs: ExpenseProof[] = [];

  constructor(
    private fb: FormBuilder,
    private suiveuseS: SuiveuseService,
  ) { 
    this.initForm();

    this.setObservables();
  }

  get initialValues(): any {
    const values = {
            expenseDate: moment(this.suiveuseS.selectedDate.getValue()).format('YYYY-MM-DD'),
            amountExclTax: 0,
            vat: 0,
            amountInclTax: 0,
          };
    return values;
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      study: [null, [Validators.required]],
      expenseDate: [null, [Validators.required]],
      chargeType: [null, [Validators.required]],
      provider: [null, [Validators.required]],
      details: [null],
      amountExclTax: [null, []],
      vat: [null, []],
      amountInclTax: [null, [Validators.required]],
      files: this.fb.array([]),
    });

    this.amountTTCForm = new FormControl();
  }

  get files() : FormArray {
    return this.form.get("files") as FormArray
  }

  addFile() {
    this.files.push(new FormControl(''));
  }

  removeFile(i:number) {
    this.files.removeAt(i);
  }

  private setObservables() {
    this.expense.asObservable()
      .pipe(
        tap(() => this.form.reset()),
        map((expense): any => {
          if (expense !== null) {
            // this.files = expense.files;
            const data = Object.assign({}, expense);
            data.study = data.study['@id'];
            this.proofs = [...expense.proofs];
            return data;
          } 
          return this.initialValues;
        }),
        tap((data: any) => this.form.patchValue(data))
      )
      .subscribe(() => this.form.updateValueAndValidity());

    combineLatest(
      this.form.get('amountExclTax').valueChanges
        .pipe(
          distinctUntilChanged(),
          filter((val) => val !== null)
        ),
      this.form.get('vat').valueChanges
        .pipe(
          distinctUntilChanged(),
          filter((val) => val !== null)
        )
    )
      .pipe(
        map(([amountExclTax, vat]: [number, number]): number => amountExclTax + vat),
        tap((value: number) => this.form.get('amountInclTax').setValue(value))
      )
      .subscribe((value: number) => this.amountTTCForm.setValue(value, {emitEvent: false}))

    this.form.get('amountInclTax').valueChanges
      .subscribe((value: number) => this.amountTTCForm.setValue(value, {emitEvent: false}))

    this.amountTTCForm.valueChanges
      .pipe(
        tap((val) => {
          this.form.get('amountExclTax').setValue(null, {emitEvent: false});
          this.form.get('vat').setValue(null, {emitEvent: false});
        })
      )
      .subscribe((value: number) => this.form.get('amountInclTax').setValue(value, {emitEvent: false}))
  }

  reset() {
    this.proofs = [];
    this.expense.next(null);
  }
}