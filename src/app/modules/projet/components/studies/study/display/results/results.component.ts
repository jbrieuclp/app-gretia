import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Observable } from 'rxjs';
import { map, tap, switchMap, startWith } from 'rxjs/operators';

import { Action, Study, Charge, StudyFunding, Work } from '@projet/repository/project.interface';
import { StudyActionsService } from '../actions/actions.service';
import { StudyService } from '../../study.service';
import { StudyChargesService } from '../charges/charges.service';
import { StudyFundingsService } from '../fundings/fundings.service';
import { SuiveuseRepository } from '@projet/repository/suiveuse.repository';
import { WorksRepository } from '@projet/repository/works.repository';

@Component({
  selector: 'app-project-study-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class StudyResultsComponent implements AfterViewInit {

  get study(): Study { return this.studyS.study.getValue(); };
  get actions(): Action[] { return this.actionsS.actions.getValue(); };
  get charges(): Charge[] { return this.chargesS.charges.getValue(); };
  get fundings(): StudyFunding[] { return this.fundingS.fundings.getValue(); };
  // get works(): Work[] { return this.fundingS.fundings.getValue(); };

  loading: boolean = true;
  resultsLength: number = null;
  displayedColumns: string[] = ['employee.person.firstname', 'workingDate', 'category.label', 'detail', 'duration'];
  worksSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  works: Work[] = [];
  totalDuration: number = 0;

  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private studyS: StudyService,
    private actionsS: StudyActionsService,
    private chargesS: StudyChargesService,
    private fundingS: StudyFundingsService,
    private suiveuseR: SuiveuseRepository,
    private worksR: WorksRepository
  ) { 
    // moment.locale('fr');
  }

  ngAfterViewInit() {
   
    merge(
      this.sort.sortChange, 
    )
      .pipe(
        startWith({}),
        map(() => {
          let params = {
            "study.id": this.study.id, 
          };

          if (this.sort.active === undefined) {
            params["_order[workingDate]"] = "desc";
          } else {
            params[`_order[${this.sort.active}]`] = this.sort.direction;
          }

          return params;
        }),
        switchMap((params) => this.getWorks(params)),
      ).subscribe(datasource => {
        this.worksSource.data = datasource;
      });
  }

  getWorks(params): Observable<Work[]> {
    this.loading = true;
    return this.worksR.works(params)
      .pipe(
        tap(() => this.loading = false),
        map((data: any): Work[]=>data["hydra:member"]),
        tap((work: Work[]) => this.totalDuration = work.map(w => w.duration).reduce((a,b) => a+b, 0)),
      );
  }

}
