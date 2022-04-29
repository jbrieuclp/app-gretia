import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {
  AUTO_STYLE,
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, BehaviorSubject, Subscription, combineLatest, merge, of } from 'rxjs';
import { tap, map, filter, distinctUntilChanged, debounceTime, switchMap, startWith, skip } from 'rxjs/operators';
import * as _ from 'lodash'; 
import * as moment from 'moment';

import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/auth/authentication.service';
import { EmployeeRepository } from '@projet/repository/employee.repository';
import { WorksRepository } from '@projet/repository/works.repository';
import { Person, Expense } from '@projet/repository/project.interface';

@Component({
  selector: 'app-user-expenses',
  templateUrl: './user-expenses.component.html',
  styleUrls: ['./user-expenses.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(300 + 'ms ease-in')),
      transition('true => false', animate(300 + 'ms ease-out'))
    ])
  ]
})
export class UserExpensesComponent implements OnInit, AfterViewInit {

  user: User;
  persons: BehaviorSubject<Person[]> = new BehaviorSubject([]);
  personControl = new FormControl('', [Validators.required]);
  expenseDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  personsLoading: boolean = false;
  loading: boolean = true;
  _subscriptions: Subscription[] = [];
  resultsLength: number = null;
  displayedColumns: string[] = ['expenseDate', 'chargeType.label', 'provider', 'study.label', 'amountInclTax', 'paymentDate'];
  $compteId: BehaviorSubject<number>;// = new BehaviorSub;

  filterInput: FormControl = new FormControl('', []);
  filtersForm: FormGroup;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  $query: Observable<any>;
  selectedRows: string[] = [];
  dataLoading: string[] = [];
  collapsed = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private authService: AuthService,
    private employeeR: EmployeeRepository,
    private worksR: WorksRepository,
  ) { 
    this.user = this.authService.getUser().value;
    this.$compteId = new BehaviorSubject(this.user.id);
  }

  ngOnInit() {

    this.$query = this.route.queryParams
          .pipe(
            filter(params => !isNaN(Number(params['person']))),
            map((params: any): number => Number(params['person'])),
            // tap((person_id) => this.$compteId.next(person_id))
          );

    this.filtersForm = this.fb.group({
      'search': [''],
      'expenseDate[after]': [null],
      'expenseDate[before]': [null],
      'paid': [true],
      'unpaid': [true],
    });

    //seulement si l'utilisateur à des droit d'admin
    if (this.user.hasRole("ROLE_PROJET_ADMIN")) {

      this.displayedColumns.unshift('checkbox');

      this.getPersons();

      /**
       * Gère la récuperation du compteId à partir de person_id transmi en URL
       **/ 
      this._subscriptions.push(
        combineLatest(
          this.persons.asObservable().pipe(skip(1)),
          this.personControl.valueChanges
        )
          .pipe(
            map(([persons, person_id]): number => {
              const person = persons.find(person => person.id === person_id);
              return person.compteId;
            })
          )
          .subscribe(compte_id => this.$compteId.next(compte_id))
      );

      /**
      * Permet de passer un user ID dans l'URL pour le selectionner dans la liste déroulante (si droit d'admin)
      **/
      this._subscriptions.push(
        this.$query 
          .subscribe((person_id) => {
            this.personControl.setValue(person_id);
          }),
      );


      /**
       * Observe le changement de la date selectionnée et ajuste l'URL en conséquence
       * ajoute la date en parametre GET dans l'URL
       **/
      this._subscriptions.push(
        this.personControl.valueChanges
          .pipe(
            distinctUntilChanged(),
          )
          .subscribe((person: number) => this.location.go(`${this.router.url.split('?')[0]}?person=${person}`))
      );
    }

    /**
     * Observe le changement de la date selectionnée et ajuste l'URL en conséquence
     * ajoute la date en parametre GET dans l'URL
     **/
    this._subscriptions.push(
      this.filtersForm.valueChanges
        .pipe(
          filter(form => !form.paid && !form.unpaid)
        )
        .subscribe(() => {
          this.filtersForm.get('paid').setValue(true, {emitEvent: false});
          this.filtersForm.get('unpaid').setValue(true, {emitEvent: false});
        })
    );

  }

  ngAfterViewInit() {
    this.loading = false;
    merge(
      this.sort.sortChange,
      this.filtersForm.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
        ),
      this.$compteId.asObservable()
    ).subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.sort.sortChange, 
      this.paginator.page,
      this.filtersForm.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        ),
      this.$compteId.asObservable()
    )
      .pipe(
        // startWith({}),
        map((val) => {
          let params = {
            itemsPerPage: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1,
            'compteId': this.$compteId.value
          };
          if (this.filtersForm.get('search').value && this.filtersForm.get('search').value !== '') {
            params['search'] = this.filtersForm.get('search').value;
          }
          if (this.filtersForm.get('expenseDate[after]').value) {
            params['expenseDate[after]'] = moment(this.filtersForm.get('expenseDate[after]').value).format('YYYY-MM-DD');
          }
          if (this.filtersForm.get('expenseDate[before]').value) {
            params['expenseDate[before]'] = moment(this.filtersForm.get('expenseDate[before]').value).format('YYYY-MM-DD');
          }
          if (!this.filtersForm.get('paid').value && this.filtersForm.get('unpaid').value) {
            params['exists[paymentDate]'] = false;
          }
          if (!this.filtersForm.get('unpaid').value && this.filtersForm.get('paid').value) {
            params['exists[paymentDate]'] = true;
          }
          if (this.sort.active === undefined) {
            params["_order[expenseDate]"] = "desc";
          } else {
            params[`_order[${this.sort.active}]`] = this.sort.direction;
          }

          return params;
        }),
        switchMap((params) => this.getUserExpense(params)),
      ).subscribe(datasource => {
        this.expenseDataSource.data = datasource;
      });
  }

  getPersons() {
    this.personsLoading = true;
    this.employeeR.persons()
      .pipe(
        tap(()=>this.personsLoading = false),
        map((data: any): Person[]=>data["hydra:member"])
      )
      .subscribe((persons: Person[])=>this.persons.next(persons));
  }

  getUserExpense(params) {
    this.loading = true;
    return this.worksR.expenses(params)
      .pipe(
        tap((res) => this.resultsLength = res['hydra:totalItems']),
        map((res): Expense[] => Object.values(res['hydra:member'])),
        tap(() => this.loading = false)
      );
  }

  onSelectAll(event) {
    this.expenseDataSource.data.forEach(e => {
      this.selectedRowsHandle(e['@id'], event.checked);
    })
  }

  onSelectRow(event) {
    if (!this.user.hasRole("ROLE_PROJET_ADMIN")) return;

    this.selectedRowsHandle(event.source.value, event.checked);
  }

  private selectedRowsHandle(uri, adding: boolean = false) {
    const idx = this.selectedRows.findIndex(item => item === uri);
    if (idx !== -1) {
      //suppression de la ligne
      this.selectedRows.splice(idx, 1);
    }
    //si la case est coché on ajoute à la selection
    if (adding) {
      this.selectedRows.push(uri);
    }
  }

  checkboxIndeterminateStatus(): boolean {
    const selectedRows = [...this.selectedRows].sort();
    const datasourceRows = [...this.expenseDataSource.data.map(e => e['@id'])].sort();
    return selectedRows.length !== 0 && !_.isEqual(selectedRows, datasourceRows); 
  }

  paidItems() {
    if (!this.user.hasRole("ROLE_PROJET_ADMIN")) return;

    this.selectedRows.forEach(uri => {
      this.paid(uri);
    })

    this.selectedRows = [];
  }

  paid(uri: string, paidStatus:boolean = true) {
    if (!this.user.hasRole("ROLE_PROJET_ADMIN")) return;

    this.dataLoading.push(uri);

    //if paidStatus: data swich to paid, else data switch to unpaid
    const paymentDate = paidStatus ? new Date() : null;
    this.employeeR.patch(uri, {'paymentDate': paymentDate})
      .pipe(
        map(expense => this.replaceExpenseDataSource(expense)),
        tap(() => {
          _.remove(this.dataLoading, function(n) {
            return n === uri;
          })
        })
      )
      .subscribe(datasource => {
        this.expenseDataSource.data = datasource;
        this.expenseDataSource.sort = this.sort;
      });
  }

  private replaceExpenseDataSource(expense) {
    let data = [...this.expenseDataSource.data];
    const idx = data.findIndex(e => e['@id'] === expense['@id']);
    if (idx !== -1) {
      data.splice(idx, 1);
    }
    data.push(expense);
    return data;
  }

}
