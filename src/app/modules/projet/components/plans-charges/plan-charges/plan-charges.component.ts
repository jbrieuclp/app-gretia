import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { filter, switchMap, tap, map } from 'rxjs/operators';

import { ProjetRepository, Projet } from '../../../repository/projet.repository';
import { Personne } from '../../../repository/salarie.repository';
import { PlanChargesService } from './plan-charges.service';

@Component({
  selector: 'app-projet-plan-charges',
  templateUrl: './plan-charges.component.html',
  styleUrls: ['./plan-charges.component.scss']
})
export class PlanChargesComponent implements OnInit {

  projects: Projet[] = [];
  person: Observable<Personne>;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private projetR: ProjetRepository,
    private planChargesS: PlanChargesService, 
  ) { }

  ngOnInit() {
    this.route.params
      .pipe(
        filter((params) => params.person),
        switchMap((params) => this.getProjects(params.person)),
      )
      .subscribe((projects) => this.projects = projects);

    this.person = this.planChargesS.person.asObservable();
  }

  getPDC(person_id): Observable<any> {
    return of(person_id)
  }

  getProjects(person_id): Observable<Projet[]> {
    this.loading = true;
    return this.projetR.projects_progression({
      'tasks.attributions.salarie.personne.id': person_id, 
      'dateDebut[after]': `this.planChargesS.year.getValue()-01-01`,
      'dateDebut[before]': `this.planChargesS.year.getValue()-12-31`,
    })
      .pipe(
        map((res): Projet[] => Object.values(res['hydra:member'])),
        tap(() => this.loading = false)
      )
  }

  getScheduledDays(projet) {
    let time = 0;
    projet.tasks.forEach(t => {
      if ( t.attributions && this.planChargesS.person.getValue()) {
        const personAttributions = t.attributions
          .filter(attribution => attribution.salarie.personne === this.planChargesS.person.getValue()['@id'])
          .map(attribution => attribution.nbJours);

        if ( personAttributions.length ) {
          time += personAttributions.reduce((a, b) => a+b)
        }
      }
    });

    return time;
  }

  getUsedDays(projet) {
    let time = 0;
    projet.tasks.forEach(t => {

      if ( t.works && this.planChargesS.person.getValue()) {
        const personWorks = t.works
          .filter(work => work.salarie.personne === this.planChargesS.person.getValue()['@id'])
          .map(work => work.temps);

        if ( personWorks.length ) {
          time += personWorks.reduce((a, b) => a+b)
        }
      }
    });

    return time / 60 / 7;
  }

}
