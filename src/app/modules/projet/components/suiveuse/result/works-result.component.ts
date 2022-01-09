import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { WorkingTimeResultsService } from './results.service';
import { Work } from '@projet/repository/project.interface';

@Component({
  selector: 'app-projet-works-works-result',
  templateUrl: './works-result.component.html',
})
export class WorksResultComponent implements OnInit {

  get works() { return this.workingTimeResultsS.works; };
  get worksLoading() { return this.workingTimeResultsS.worksLoading; };

  get groupElements() {
    return this.works
      .map(elem => elem[(this.orderByControl.value).field])
      .filter((elem, index, self) => index === self.findIndex((t) => _.isEqual(t, elem))) //dédoublonne
      .sort();
  }

  orderByList: any[] = [
    {field: "workingDate", label: "Date", type: "date"},
    {field: "action", label: "Action", type: "path", path: "label"},
    {field: "study", label: "Étude", type: "path", path: "label"},
    {field: "category", label: "Catégorie", type: "path", path: "label"},
    {field: "isNight", label: "Nuit / jour", type: "boolean", values: {"true": 'Nuit', "false": 'Journée'}},
    {field: "isWe", label: "Semaine / WE", type: "boolean", values: {"true": 'Week-End', "false": 'Semaine'}},
  ];
  orderByControl: FormControl = new FormControl();

  constructor(
    private workingTimeResultsS: WorkingTimeResultsService,
  ) { }

  ngOnInit() {
    this.orderByControl.setValue(this.orderByList[0]);
  }
  
  getTitle(group) {
    const orderBy = this.orderByControl.value;

    if (orderBy.type === 'boolean') {
      return group ? orderBy.values['true'] : orderBy.values['false'];
    } else if (orderBy.type === 'date') {
      return moment(group).format('DD/MM/YYYY');
    } else if (orderBy.type === 'path') {
      return _.get(group, orderBy.path);
    } else {
      return "Autre"
    }
  }

  getWorksByGroup(group): Work[] { 
    return this.works.filter((work: Work) => _.isEqual(work[(this.orderByControl.value).field], group) ); 
  };

  getWorkTimeByGroup(group) { 
    const duration = this.getWorksByGroup(group)
                          .map((work: Work): number => work.duration)
                          .reduce((a, b): number => a + b, 0);
    return Math.round(duration / 60 * 100) / 100;
  };
}
