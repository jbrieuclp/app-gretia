import { Component, OnInit, Input, Inject } from '@angular/core';
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import _ from 'lodash';

import { Travel, ChargeType } from '../../../../../repository/project.interface';
import { ChargeTypeRepository } from '../../../../../repository/charge-type.repository';
import { ExpenseFormService } from '../expense-form/expense-form.service';
import { WorkFormService } from '../work-form.service';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-projet-work-travel-form-dialog',
  templateUrl: './travel-form.dialog.html',
  styleUrls: ['./travel-form.dialog.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', visibility: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class TravelFormDialog implements OnInit {

  form: FormGroup;
  expenseForm: FormGroup;
  travel: Travel = {};
  travelKMCost: BehaviorSubject<number> = new BehaviorSubject(null);
  iWasDriving: boolean = true;
  chargeTypeLoading: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(
    public dialogRef: MatDialogRef<TravelFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private expenseFormS: ExpenseFormService,
    private chargeTypeR: ChargeTypeRepository,
    private workFormS: WorkFormService,
  ) { 
    this.travel = this.data.travel;
  }

  private get initialValues(): any {
    const values = {
            duration: 0,
            carpool: false,
          };
    return values;
  }

  ngOnInit() {
    this.form = this.fb.group({
      travel: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      distance: [null, [Validators.required]],
    });

    this.form.patchValue(_.isEmpty(this.travel) ? this.initialValues : this.travel);

    this.setExpenseForm();

    this.setObservables();
  }

  private setExpenseForm(): void {
    this.expenseForm = this.expenseFormS.getForm();

    this.chargeTypeLoading = true;
    this.chargeTypeR.chargeTypes({code: 'TRAVEL'})
      .pipe(
        tap(() => this.chargeTypeLoading = false),
        map((data: any): ChargeType[] => data["hydra:member"]),
        map((data: ChargeType[]): ChargeType => data.shift()),
        filter((chargeType: ChargeType) => chargeType !== null),
        tap((chargeType: ChargeType) => this.travelKMCost.next(chargeType.unitCost)),
        map((chargeType: ChargeType): string => chargeType['@id']),
      )
      .subscribe((id: string) => this.expenseForm.get('chargeType').setValue(id));
  }

  private setObservables(): void {
    this.subscriptions.push( 
      this.form.get('travel').valueChanges
        .subscribe(value => this.expenseForm.get('provider').setValue(value))
    );

    this.subscriptions.push( 
      combineLatest(
        this.form.get('distance').valueChanges,
        this.travelKMCost.asObservable()
          .pipe(
            filter(val => val !== null)
          ),
      )
        .pipe(
          tap(([value, cost]: [number, number]): void => {
            this.expenseForm.get('details').setValue(`Frais de déplacement : ${value} km x ${cost} €/km`)
          }),
          map(([value, cost]: [number, number]): number => {
            return (Math.round(value * cost * 100)) / 100
          })
        )
        .subscribe(value => this.expenseForm.get('amountInclTax').setValue(value))
    );
  }

  onSliderChange(state) {
    this.iWasDriving = state;
    if (!state) {
      this.form.get('distance').setValue(null);
      this.form.get('distance').setValidators([]);
    } else {
      this.form.get('distance').setValidators([Validators.required]);
    }
  }

  ajouter() {
    if (this.form.valid) {
      Object.assign(this.travel, this.form.value);
      if (this.workFormS.travels.findIndex(e => e === this.travel) === -1) {
        //si creation on ajoute au tableau
        this.workFormS.travels.push(this.travel);
      }

      if (this.iWasDriving && this.expenseForm.valid) {
        //si creation on ajoute au tableau
        this.workFormS.expenses.push(this.expenseForm.value);
      }
      this.dialogRef.close();
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }
}
