import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable } from 'rxjs';
import { map, tap, switchMap, startWith } from 'rxjs/operators';

import { PersonRepository } from '@projet/repository/person.repository';

@Component({
  selector: 'app-project-admin-expenses',
  templateUrl: './admin-expenses.component.html',
  styleUrls: ['./admin-expenses.component.scss']
})
export class AdminExpensesComponent implements AfterViewInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  navigation: any;
  resultsLength: number = null;
  displayedColumns: string[] = ['person.firstname', 'paid', 'unpaid'];
  loading: boolean = false;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private personR: PersonRepository,
  ) { }


  ngAfterViewInit() {

   
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0)

    merge(
      this.sort.sortChange, 
      this.paginator.page
    )
      .pipe(
        startWith({}),
        map((val) => {
          let params = {
            itemsPerPage: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1
          };
          if (this.sort.active === undefined) {
            params["_order[person.firstname]"] = "asc";
          } else {
            params[`_order[${this.sort.active}]`] = this.sort.direction;
          }

          return params;
        }),
        switchMap((params) => this.getPayment(params)),
      ).subscribe(datasource => {
        this.dataSource.data = datasource;
      });
  }

  getPayment(params: any = {}): Observable<any[]> {
    console.log("plop");
    console.log(params);
    this.loading = true;
    return this.personR.getPaymentByPersons(params)
      .pipe(
        tap((res) => {
          this.navigation = res['hydra:view'];
          this.resultsLength = res['hydra:totalItems'];
        }),
        map((res): any[] => Object.values(res['hydra:member'])),
        tap(() => this.loading = false)
      )
  }
}
