import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { StudiesRepository } from '../../repository/studies.repository';
import { Week, Study } from '../../repository/project.interface';
import { WeeksService } from '../studies/study/display/actions/action/weeks/weeks.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss']
})
export class ProjetAccueilComponent implements OnInit, OnDestroy {

	projets: Study[] = [];
  year: number = moment().year();

  _subscriptions: Subscription[] = []

  constructor(
    private projetR: StudiesRepository,
    private weeksS: WeeksService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
    	this.projetR.myStudies()
    		.pipe(
    			map((res): Study[] => Object.values(res['hydra:member']))
    		)
        .subscribe((projets: Study[])=>this.projets = projets)
    );

    this._subscriptions.push(
      this.weeksS.week.asObservable()
        .pipe(
          filter((week: Week) => week !== null)
        )
        .subscribe((week: Week)=> console.log(week))
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

  actionsDay(projet) {
    let days = 0;
    projet.actions.forEach(t => { days += t.nbJours; });
    return days;
  }

  actionsDayDone(projet) {
    let days = 0;
    projet.actions.forEach(t => { days += t.numberDaysDone; });
    return days;
  }

  getWeekTooltip(week) {
    // let tooltip: {projet: {'@id': string, label: string, actions: string[]}}[] = [];

    // let projet = this.projets.filter(projet => 
    //               projet.actions.filter(action => 
    //                 action.periods.findIndex(period => period['@id'] === week['@id']) !== -1
    //               )
    //             )
    // this.projets.forEach(projet => {
    //   projet.actions.forEach(action => { 
    //     if (action.periods.findIndex(p => p['@id'] === week['@id']) !== -1) {
    //       if


    //       tooltip.push({week: week, data: []});
    //     }
    //   });
    // })
    // return data;
  }

  /**
   * Retourne un tableau des observateurs (prenom nom)
   * Sert aussi à la mise en forme du tooltip
   */
  displayObservateursTooltip(row): string[] {
    let tooltip = [];
    if (row.observers === undefined) {
      if (row.observers_txt !== null && row.observers_txt.trim() !== "") {
        tooltip.push(row.observers_txt.trim());
      } else {
        tooltip.push("Aucun observateurs");
      }
    } else {
      for (let i = 0; i < row.observers.length; i++) {
        let obs = row.observers[i];
        tooltip.push([obs.prenom_role, obs.nom_role].join(" "));
      }
    }

    return tooltip.sort();
  }

}
