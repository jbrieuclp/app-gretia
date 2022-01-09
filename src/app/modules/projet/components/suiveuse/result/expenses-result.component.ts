import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { WorkingTimeResultsService } from './results.service';
import { Expense } from '@projet/repository/project.interface';

@Component({
  selector: 'app-projet-works-expenses-result',
  templateUrl: './expenses-result.component.html',
})
export class ExpensesResultComponent implements OnInit {

  get expenses() { return this.workingTimeResultsS.expenses; };
  get expensesLoading() { return this.workingTimeResultsS.expensesLoading; };

  get groupElements() {
    return this.expenses
      .map(elem => elem[(this.orderByControl.value).field])
      .filter((elem, index, self) => index === self.findIndex((t) => _.isEqual(t, elem))) //dédoublonne
      .sort();
  }

  orderByList: any[] = [
    {field: "expenseDate", label: "Date", type: "date"},
    {field: "study", label: "Étude", type: "path", path: "label"},
    {field: "chargeType", label: "Type de frais", type: "path", path: "label"},
    {field: "isDriver", label: "Conducteur oui/non", type: "boolean", values: {"true": 'Conducteur', "false": 'Passager'}},
  ];
  orderByControl: FormControl = new FormControl();

  constructor(
    private workingTimeResultsS: WorkingTimeResultsService,
  ) { }

  ngOnInit() {
    this.orderByControl.setValue(this.orderByList[0]);
  }
  
  getTitle(group) {
    const orderBy = this.orderByControl.value;

    if (orderBy.type === 'boolean') {
      return group ? orderBy.values['true'] : orderBy.values['false'];
    } else if (orderBy.type === 'date') {
      return moment(group).format('DD/MM/YYYY');
    } else if (orderBy.type === 'path') {
      return _.get(group, orderBy.path);
    } else {
      return "Autre"
    }
  }

  getExpensesByGroup(group): Expense[] { 
    return this.expenses.filter((expense: Expense) => _.isEqual(expense[(this.orderByControl.value).field], group) ); 
  };

  getExpensesAmountByGroup(group) { 
    const amount = this.getExpensesByGroup(group)
                          .map((expense: Expense): number => expense.amountInclTax)
                          .reduce((a, b): number => a + b, 0);
    return Math.round(amount * 100) / 100;
  };
}
