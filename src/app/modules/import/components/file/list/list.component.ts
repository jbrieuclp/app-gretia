import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { merge, Observable, combineLatest, BehaviorSubject, of } from 'rxjs';
import { startWith, tap, map, switchMap, distinctUntilChanged, debounceTime } from 'rxjs/operators';

import { ImportService } from '../../../services/import.service';

@Component({
  selector: 'app-import-files-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class FilesListComponent implements OnInit, AfterViewInit {

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'table', 'fileName', 'avancement', 'dateImport', 'clos'];
  filterInput: FormControl = new FormControl('', []);
  closing: BehaviorSubject<boolean> = new BehaviorSubject(true);
  notClosing: BehaviorSubject<boolean> = new BehaviorSubject(true);
  loading: boolean = true;

  navigation: any;
  resultsLength: number = 0;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  
  constructor(
    private importS: ImportService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  private getFiles(params: any = {}): Observable<any[]> {
    this.loading = true;
    return this.importS.getFiles(params)
        .pipe(
          tap((res) => {
            this.navigation = res['hydra:view'];
            this.resultsLength = res['hydra:totalItems'];
            this.loading = false;
          }),
          map((res) => res['hydra:member'])
        )
  }

  changeStatus(file) {
    this.importS.switchStatus(file.id)
                    .subscribe(result=> {
                      if (result) 
                        window.location.reload();
                    });
  }

  ngAfterViewInit() {

    merge(
      this.sort.sortChange,
      this.filterInput.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        ),
      this.closing.asObservable(),
      this.notClosing.asObservable()
    ).subscribe(() => this.paginator.pageIndex = 0);

    merge(
      this.sort.sortChange, 
      this.paginator.page,
      this.closing.asObservable(),
      this.notClosing.asObservable(),
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
            page: this.paginator.pageIndex + 1,
          };
          if (this.closing.value !== this.notClosing.value) {
            params['clos'] = this.closing.value;
          }
          if (this.filterInput.value && this.filterInput.value !== '') {
            params['table'] = this.filterInput.value;
          }
          if (this.sort.active === undefined) {
            params["_order[dateImport]"] = "desc";
          } else {
            params[`_order[${this.sort.active}]`] = this.sort.direction;
          }

          return params;
        }),
        switchMap((params) => this.getFiles(params)),
      ).subscribe(datasource => {
        this.dataSource.data = datasource;
        // this.dataSource.sort = this.sort;
      });
  }

  getAvancement(file) {
    return file.fields.length ? (file.numberFieldDone / file.fields.length) * 100 : 0;
  }

}
