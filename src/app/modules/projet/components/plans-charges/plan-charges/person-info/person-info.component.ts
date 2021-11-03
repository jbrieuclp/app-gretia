import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { switchMap, tap, filter } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { PlanChargesService } from '../plan-charges.service';
import { PersonRepository } from '../../../../repository/person.repository';
import { Work, Action, Study, Employee } from '../../../../repository/project.interface';

@Component({
  selector: 'app-projet-pdc-person-info',
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.scss']
})
export class PDCPersonInfoComponent implements OnInit {

  workedRepartition: any[] = [];
  loading: boolean = false;
  get year() { return this.planChargesS.year.getValue(); };

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

  /**
  *  Retourne une date à afficher pour le début du plan de charge
  *  Si le début du contrat est antérieure à l'année en cours retourne le 1er janvier, sinon la date de début du contrat
  */
  startingDate(contractStart) {
    return (moment([this.year]).isSameOrAfter(contractStart.date) ? moment([this.year]) :  moment(contractStart.date)).format('YYYY-MM-DD');
  }

  /**
  *  Retourne une date à afficher pour la fin du plan de charge
  *  Si la fin contrat est postérieur à l'année en cours retourne le 31 décembre, sinon la date de fin du contrat
  */
  endDate(contractEnd) {
    if ( contractEnd !== null && moment(contractEnd.date).isSameOrBefore([this.year, 11, 31])) {
      return moment(contractEnd.date).format('YYYY-MM-DD')
    }
    return moment([this.year, 11, 31]).format('YYYY-MM-DD');
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

  getNbJours(employee, param) {
    const pc = this.findParam(employee.params, param).value;
    //arrondi au 0.5 *2 / 2
    return Math.round(employee.days_info.openDays * pc * (employee.rate/100) * 2) / 2;
  }

  /**
  *  Retourne la sum des pourcentage par type pour un employee
  */
  getSumParamPercent(employee) {
    return employee.params.map(p => p.value * 100).reduce((a, b) => a+b);
  }

  /**
  *  Retourne le nombre jour théorique dispo pour un salarié type par type de temps en prenant en compte le taux de travail
  */
  getSumDays(employee) {
    return employee.params
      //arrondi au 0.5
      .map(p => Math.round(p.value * employee.days_info.openDays * (employee.rate/100) * 2) / 2)
      .reduce((a, b) => a+b);
  }

  /**
  *  Retourne la somme de jour théorique dispo pour une personne par type (cumule des employees)
  */
  getSumByParam(param) {
    const $this = this;
    return this.workedRepartition
      .map(employee => Math.round(this.findParam(employee.params, param).value * employee.days_info.openDays * (employee.rate/100) * 2) / 2)
      .reduce((a, b) => a+b);
  }

  /**
  *  Retourne le nombre jour total théorique dispo pour une personne
  */
  getTotalDays() {
    return this.workedRepartition
      .map(employee => this.getSumDays(employee))
      .reduce((a, b) => a+b);
  }

  getUsedDaysByParam(employee, param) {
    let duration = this.planChargesS.studies.getValue()
      .filter((s: Study) => `PERCENT_DAYS_${s.type}` === param)
      .map((s: Study) => 
        s.actions
          .map((a: Action): number => 
            a.works
              .filter((w: Work) => w.employee.person === this.planChargesS.person.getValue()['@id'])
              .filter((w: Work) => {
                if (employee.contractEnd !== null) {
                  return moment(w.workingDate).isBetween(employee.contractStart.date, employee.contractEnd.date, undefined, '[]')
                }
                return moment(w.workingDate).isSameOrAfter(employee.contractStart.date);
              })
              .map((w: Work): number => w.duration)
              .reduce((a, b) => a+b, 0)
          )
          .reduce((a, b) => a+b, 0)
      )
      .reduce((a, b) => a+b, 0);
    return Math.round(duration / 60 / 7 * 100) / 100
  }

  getUsedDays(study) {
    let duration = 0;
    study.actions.forEach((a: Action) => {

      if ( a.works && this.planChargesS.person.getValue()) {
        const personWorks = a.works
          .filter((work: Work) => work.employee.person === this.planChargesS.person.getValue()['@id'])
          .map((work: Work) => work.duration);

        if ( personWorks.length ) {
          duration += personWorks.reduce((a, b) => a+b)
        }
      }
    });

    return Math.round(duration / 60 / 7 * 100) / 100;
  }
}
