import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { PlanChargesService } from '../plan-charges.service';
import { PersonRepository } from '../../../../repository/person.repository';
import { Personne } from '../../../../repository/salarie.repository';

@Component({
  selector: 'app-project-pdc-person-info',
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.scss']
})
export class PDCPersonInfoComponent implements OnInit {

  workedRepartition: any[] = [];
  loading: boolean = false;

  constructor(
    private planChargesS: PlanChargesService, 
    private personR: PersonRepository, 
  ) { }

  ngOnInit() {
    combineLatest(
      this.planChargesS.person.asObservable()
        .pipe(filter(person => person !== null)),
      this.planChargesS.year.asObservable()
        .pipe(filter(year => year !== null))
    )
      .pipe(
        switchMap(([person, year]) => this.getWorkedDaysRepartition(person, year)),
      )
      .subscribe(data => this.workedRepartition = data);
  }

  getWorkedDaysRepartition(person, year): Observable<any> {
    this.loading = true;
    return this.personR.getWorkedDaysRepartition(person.id, year)
              .pipe(
                tap(()=>this.loading = false)
              );
  } 

  findParam(params, key) {
    return params.find(e => e.code === key);
  }

  getNbJours(salarie, param) {
    const pc = this.findParam(salarie.params, param).value;
    //arrondi au 0.5 *2 / 2
    return Math.round(salarie.days_info.openDays * pc * (salarie.taux/100) * 2) / 2;
  }

  /**
  *  Retourne la sum des pourcentage par type pour un salarie
  */
  getSumParamPercent(salarie) {
    return salarie.params.map(p => p.value * 100).reduce((a, b) => a+b);
  }

  /**
  *  Retourne le nombre jour théorique dispo pour un salarié type par type de temps en prenant en compte le taux de travail
  */
  getSumDays(salarie) {
    return salarie.params
      //arrondi au 0.5
      .map(p => Math.round(p.value * salarie.days_info.openDays * (salarie.taux/100) * 2) / 2)
      .reduce((a, b) => a+b);
  }

  /**
  *  Retourne la somme de jour théorique dispo pour une personne par type (cumule des salaries)
  */
  getSumByParam(param) {
    const $this = this;
    return this.workedRepartition
      .map(salarie => Math.round(this.findParam(salarie.params, param).value * salarie.days_info.openDays * (salarie.taux/100) * 2) / 2)
      .reduce((a, b) => a+b);
  }

  /**
  *  Retourne le nombre jour total théorique dispo pour une personne
  */
  getTotalDays() {
    return this.workedRepartition
      .map(salarie => this.getSumDays(salarie))
      .reduce((a, b) => a+b);
  }

  getUsedDaysByParam(salarie, param) {
    let time = this.planChargesS.projects.getValue()
      .filter(p => `PERCENT_DAYS_${p.type}` === param)
      .map(p => 
        p.tasks
          .map((t): number => 
            t.works
              .filter(w => w.salarie.personne === this.planChargesS.person.getValue()['@id'])
              .filter(w => {
                if (salarie.date_fin !== null) {
                  return moment(w.dateTravail).isBetween(salarie.date_debut, salarie.date_fin, undefined, '[]')
                }
                return moment(w.dateTravail).isSameOrAfter(salarie.date_debut);
              })
              .map((w): number => w.temps)
              .reduce((a, b) => a+b, 0)
          )
          .reduce((a, b) => a+b, 0)
      )
      .reduce((a, b) => a+b, 0);
    return Math.round(time / 60 / 7 * 100) / 100
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

    return Math.round(time / 60 / 7 * 100) / 100;
  }
}
