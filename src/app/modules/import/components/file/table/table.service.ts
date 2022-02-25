import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators'
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { ImportService } from '@import/services/import.service';
import { FileDataService } from '@import/services/file.service';

@Injectable()
export class TableService {

  dataSource: any[] = [];
  headers: string[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  request: any = {};
  sort: MatSort;
  paginator: MatPaginator;

  get fichierId() { return this.fileDataS.file_id.value; };

	constructor(
    private importS: ImportService,
    private fileDataS: FileDataService
  ) { }

  getDataSource(request) {
    this.request = request;

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.importS.tableView(this.fichierId, this.request, this.sort.active, this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
        }),
        map(data => {
          this.resultsLength = data.resultsLength;
          this.isLoadingResults = false;
          this.headers = data.items.length ? Object.keys(data.items[0]) : [];
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          return observableOf([]);
        })
      ).subscribe(data => this.dataSource = data);
  }

  initTableEvent() {
    
  }
}