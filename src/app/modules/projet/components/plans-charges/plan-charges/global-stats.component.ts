import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { PersonRepository } from '../../../repository/person.repository';
import { PlanChargesService } from './plan-charges.service';

@Component({
  selector: 'app-projet-pdc-global-stats',
  templateUrl: './global-stats.component.html',
  styleUrls: ['./global-stats.component.scss']
})
export class GlobalStatsComponent implements OnInit {

  stats: any;
  loading: boolean = false;

  constructor(
    private personR: PersonRepository,
    private planChargesS: PlanChargesService, 
  ) { }

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.planChargesS.year.asObservable()
      .pipe(
        distinctUntilChanged(),
        tap(() => this.loading = true),
        switchMap(year=>this.personR.getYearDaysInfo(year)),
        tap(() => this.loading = false),
      )
      .subscribe(stats => this.stats = stats);
  }

}
