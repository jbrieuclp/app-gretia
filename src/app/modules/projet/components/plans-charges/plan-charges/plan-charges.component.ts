import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, switchMap, tap, map } from 'rxjs/operators';

import { StudiesRepository } from '../../../repository/studies.repository';
import { Person, Study } from '../../../repository/project.interface';
import { PlanChargesService } from './plan-charges.service';

@Component({
  selector: 'app-projet-plan-charges',
  templateUrl: './plan-charges.component.html',
  styleUrls: ['./plan-charges.component.scss']
})
export class PlanChargesComponent implements OnInit {

  get studies(): Study[] { return this.planChargesS.studies.getValue(); };
  get person(): Person { return this.planChargesS.person.getValue(); };
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private studyR: StudiesRepository,
    private planChargesS: PlanChargesService, 
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        filter((params) => params.person),
        switchMap((params) => this.getProjects(params.person))
      )
      .subscribe((studies) => this.planChargesS.studies.next(studies));
  }

  getPDC(person_id): Observable<any> {
    return of(person_id)
  }

  getProjects(person_id): Observable<Study[]> {
    this.loading = true;
    return this.studyR.studies_progression({
      'actions.attributions.employee.person.id': person_id, 
      'dateEnd[after]': `${this.planChargesS.year.getValue()}-01-01`,
      'dateStart[before]': `${this.planChargesS.year.getValue()}-12-31`,
    })
      .pipe(
        map((res): Study[] => Object.values(res['hydra:member'])),
        tap(() => this.loading = false)
      )
  }

  getScheduledDays(study) {
    let time = 0;
    study.actions.forEach(t => {
      if ( t.attributions && this.planChargesS.person.getValue()) {
        const personAttributions = t.attributions
          .filter(attribution => attribution.employee.person === this.planChargesS.person.getValue()['@id'])
          .map(attribution => attribution.nbOfDays);

        if ( personAttributions.length ) {
          time += personAttributions.reduce((a, b) => a+b)
        }
      }
    });

    return time;
  }

  getUsedDays(study) {
    let time = 0;
    study.actions.forEach(t => {

      if ( t.works && this.planChargesS.person.getValue()) {
        const personWorks = t.works
          .filter(work => work.employee.person === this.planChargesS.person.getValue()['@id'])
          .map(work => work.duration);

        if ( personWorks.length ) {
          time += personWorks.reduce((a, b) => a+b)
        }
      }
    });

    return time / 60 / 7;
  }

}
