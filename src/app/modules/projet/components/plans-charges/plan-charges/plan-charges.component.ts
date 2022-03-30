import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { merge, Observable, of as observableOf, combineLatest } from 'rxjs';
import { catchError, map, startWith, switchMap, distinctUntilChanged, filter, tap, debounceTime } from 'rxjs/operators';

import { Person, Study } from '@projet/repository/project.interface';
import { PlansChargesService } from '../plans-charges.service';
import { StudiesRepository } from '@projet/repository/studies.repository';
import { PlanChargeInfoDialog } from '../plan-charge-info/plan-charge-info.dialog';

@Component({
  selector: 'app-projet-plan-charges',
  templateUrl: './plan-charges.component.html',
  styleUrls: ['./plan-charges.component.scss']
})
export class PlanChargesComponent implements AfterViewInit {

  studies: Study[] = [];
  get person(): Person { return this.plansChargesS.person; };

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  filterInput: FormControl = new FormControl('', []);
  loading: boolean = false;

  resultsLength: number = null;
  displayedColumns: string[] = ['study.code', 'study.label', 'expectedTime', 'consumedTime', 'usagePercent'];

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    private studyR: StudiesRepository,
    private plansChargesS: PlansChargesService, 
  ) { }


  ngAfterViewInit() {

    merge(
      this.sort.sortChange,
      this.filterInput.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        ),
      combineLatest(
        this.plansChargesS.$person.pipe(
          distinctUntilChanged(),
          filter(val => val !== null)
        ),
        this.plansChargesS.$year.pipe(
          distinctUntilChanged(),
          filter(val => val !== null)
        )
      )
    ).subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.sort.sortChange, 
      this.paginator.page,
      this.filterInput.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        ),
      combineLatest(
        this.plansChargesS.$person.pipe(
          distinctUntilChanged(),
          filter(val => val !== null)
        ),
        this.plansChargesS.$year.pipe(
          distinctUntilChanged(),
          filter(val => val !== null)
        )
      )
    )
      .pipe(
        // startWith({}),
        map((val) => {
          let params = {
            itemsPerPage: this.paginator.pageSize,
            page: this.paginator.pageIndex + 1,
            'person.id': this.plansChargesS.person.id, 
            'dateStart[lte]': `${this.plansChargesS.year}`,
            'dateEnd[gte]': `${this.plansChargesS.year}`
          };
          if (this.filterInput.value && this.filterInput.value !== '') {
            params['table'] = this.filterInput.value;
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

  getStudies(params: any = {}): Observable<Study[]> {
    this.loading = true;
    return this.studyR.study_progressions(params)
      .pipe(
        tap((res) => this.resultsLength = res['hydra:totalItems']),
        map((res): Study[] => Object.values(res['hydra:member'])),
        tap(() => this.loading = false)
      )
  }

  openStudyInfo(study) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = study;
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = 'dialog-95';

    const dialogRef = this.dialog.open(PlanChargeInfoDialog, dialogConfig);
  }

}
