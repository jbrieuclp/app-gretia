import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Observable, of as observableOf, combineLatest } from 'rxjs';
import { catchError, map, startWith, switchMap, distinctUntilChanged, filter, tap } from 'rxjs/operators';

import { Person, Study } from '@projet/repository/project.interface';
import { PlansChargesService } from '../plans-charges.service';
import { StudiesRepository } from '@projet/repository/studies.repository';

@Component({
  selector: 'app-projet-plan-charges',
  templateUrl: './plan-charges.component.html',
  styleUrls: ['./plan-charges.component.scss']
})
export class PlanChargesComponent implements AfterViewInit {

  studies: Study[] = [];
  get person(): Person { return this.plansChargesS.person; };
  loading: boolean = false;
  resultsLength: number = null;
  displayedColumns: string[] = ['code', 'label'];
  view: any;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
    private studyR: StudiesRepository,
    private plansChargesS: PlansChargesService, 
  ) { }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    combineLatest(
      this.plansChargesS.$person.pipe(
        distinctUntilChanged(),
        filter(val => val !== null)
      ),
      this.plansChargesS.$year.pipe(
        distinctUntilChanged(),
        filter(val => val !== null)
      ),
    )
      .pipe(
        tap((val) => console.log(val)),
        switchMap(([person, year]) => this.getStudies(person, year)),
        // this.sort.active, this.sort.direction, this.paginator.pageIndex);
        catchError(() => {
          this.loading = false;
          return observableOf([]);
        })
      ).subscribe(data => this.studies = data);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        switchMap((param: any): Observable<any> => {
          this.loading = true;
          if (param.previousPageIndex < param.pageIndex) {
            return this.studyR.get(this.view['hydra:next']);
          } else {
            return this.studyR.get(this.view['hydra:previous']);
          }
        }),
        tap((res) => {
          this.resultsLength = res['hydra:totalItems']
          this.view = res['hydra:view']
        }),
        map((res): Study[] => Object.values(res['hydra:member'])),
        tap(() => this.loading = false)
      )
      .subscribe(data => this.studies = data);
  }

  getStudies(person, year): Observable<Study[]> {
    this.loading = true;
    return this.studyR.studies_progression({
      'actions.attributions.employee.person.id': person.id, 
      'dateEnd[after]': `${year}-01-01`,
      'dateStart[before]': `${year}-12-31`,
    })
      .pipe(
        tap((res) => {
          this.resultsLength = res['hydra:totalItems']
          this.view = res['hydra:view']
        }),
        map((res): Study[] => Object.values(res['hydra:member'])),
        tap(() => this.loading = false)
      )
  }













  // ngOnInit() {

  // }


  // getPDC(person_id): Observable<any> {
  //   return of(person_id)
  // }

  // getScheduledDays(study) {
  //   let time = 0;
  //   study.actions.forEach(t => {
  //     if ( t.attributions && this.plansChargesS.person) {
  //       const personAttributions = t.attributions
  //         .filter(attribution => attribution.employee.person === this.plansChargesS.person['@id'])
  //         .map(attribution => attribution.nbOfDays);

  //       if ( personAttributions.length ) {
  //         time += personAttributions.reduce((a, b) => a+b)
  //       }
  //     }
  //   });

  //   return time;
  // }

  // getUsedDays(study) {
  //   let time = 0;
  //   study.actions.forEach(t => {

  //     if ( t.works && this.plansChargesS.person) {
  //       const personWorks = t.works
  //         .filter(work => work.employee.person === this.plansChargesS.person['@id'])
  //         .map(work => work.duration);

  //       if ( personWorks.length ) {
  //         time += personWorks.reduce((a, b) => a+b)
  //       }
  //     }
  //   });

  //   return time / 60 / 7;
  // }

}
