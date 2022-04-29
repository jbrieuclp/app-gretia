import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, combineLatest, BehaviorSubject, merge } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { StudiesRepository } from '../../repository/studies.repository';
import { Study } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(300 + 'ms ease-in')),
      transition('true => false', animate(300 + 'ms ease-out'))
    ])
  ]
})
export class StudiesComponent implements AfterViewInit {

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public resultsLength: number = null;
  public displayedColumns: string[] = ['study.code', 'study.label', 'locals', 'dateStart', 'dateEnd', 'nbOfDays', 'consumedTime', 'usagePercent'];
  public filterInput: FormControl = new FormControl('', []);
  public loading: boolean = true;
  public collapsed = true;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private studiesR: StudiesRepository,
  ) { }

  ngAfterViewInit() {

    merge(
      this.sort.sortChange,
      this.filterInput.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
    ).subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.sort.sortChange, 
      this.paginator.page,
      this.filterInput.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
    )
      .pipe(
        startWith({}),
        map((val) => {
          let params = {
            itemsPerPage: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1
          };
          if (this.filterInput.value && this.filterInput.value !== '') {
            params['search'] = this.filterInput.value;
          }
          if (this.sort.active === undefined) {
            params["_order[study.label]"] = "asc";
          } else {
            params[`_order[${this.sort.active}]`] = this.sort.direction;
          }

          return params;
        }),
        switchMap((params) => this.getStudies(params)),
      ).subscribe(datasource => {
        this.dataSource.data = datasource;
      });
  }

  getStudies(params): Observable<Study[]> {
    this.loading = true;
    return this.studiesR.study_progressions(params)
      .pipe(
        tap(()=>this.loading = false),
        tap((data: any) => this.resultsLength = data["hydra:totalItems"]),
        map((data: any): Study[]=>data["hydra:member"])
      );
  }
}
