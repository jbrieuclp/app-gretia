import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { PersonRepository } from '@projet/repository/person.repository';
import { PlansChargesService } from '../plans-charges.service';

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
    public plansChargesS: PlansChargesService, 
  ) { }

  ngOnInit() {
    this.getStats();
  }

  getStats() {
    this.plansChargesS.$year
      .pipe(
        distinctUntilChanged(),
        tap(() => this.loading = true),
        switchMap(year=>this.personR.getYearDaysInfo({'year': year})),
        tap(() => this.loading = false),
      )
      .subscribe(stats => this.stats = stats);
  }

}
