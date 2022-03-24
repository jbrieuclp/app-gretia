import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { ActionProgression } from '@projet/repository/project.interface';
import { PlansChargesService } from '../plans-charges.service';
import { ActionsRepository } from '@projet/repository/actions.repository';
import { WorksRepository } from '@projet/repository/works.repository';
import { Person, Work } from '@projet/repository/project.interface';

@Component({
  selector: 'app-plan-charge-info',
  templateUrl: './plan-charge-info.dialog.html',
  styleUrls: ['./plan-charge-info.dialog.scss']
})
export class PlanChargeInfoDialog implements OnInit {

  actions: ActionProgression[] = [];
  works = [];
  worksLoading: boolean = false;
  get person(): Person { return this.plansChargesS.person; };
  get objectives() { 
    return this.actions.filter(action => action.action !== null)
                       .map(action => action.action.objective)
                       .filter((elem, index, self) => elem !== null && index === self.findIndex((t) => t['@id'] === elem['@id'])); //dédoublonne
  };

  constructor(
    public dialogRef: MatDialogRef<PlanChargeInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public study: any,
    private actionsR: ActionsRepository,
    private plansChargesS: PlansChargesService, 
    private worksR: WorksRepository,
  ) { }

  ngOnInit() {
    this.getActionProgression();
    this.getWorks().subscribe((works: Work[]) => this.works = works);
  }

  getWorks(params?: any): Observable<Work[]> {
    this.worksLoading = true;
    this.works = [];

    if (params === undefined) {
      params = {
        compteId: this.person.compteId,
        'study.id': this.study.id,
      }
    }

    return this.worksR.works(params)
      .pipe(
        // tap(() => this.searching = false),
        tap(() => this.worksLoading = false),
        map((data: any): Work[] => data["hydra:member"]),
      );
  } 

  private getActionProgression() {
    const params = {
      'study.id': this.study.id,
      'person.id': this.plansChargesS.person.id,
    }
    this.actionsR.action_progressions(params)
      .pipe(
        map((res): ActionProgression[] => Object.values(res['hydra:member'])),
      )
      .subscribe(actions => this.actions = actions)
  }

  getActionByObjectif(objectif) {
    return this.actions.filter(action => action.action !== null && _.isEqual(action.action.objective, objectif))
  }

  displayDuration(duration: number): string {
    const hour = Math.floor(duration/60);
    const minute = (duration % 60) < 10 ? `0${duration % 60}` : duration % 60;
    return `${hour}h${minute}`;
  }
}
