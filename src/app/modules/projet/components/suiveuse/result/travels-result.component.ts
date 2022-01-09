import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { WorkingTimeResultsService } from './results.service';
import { Travel } from '@projet/repository/project.interface';

@Component({
  selector: 'app-projet-works-travels-result',
  templateUrl: './travels-result.component.html',
})
export class TravelsResultComponent implements OnInit {

  get travels() { return this.workingTimeResultsS.travels; };
  get travelsLoading() { return this.workingTimeResultsS.travelsLoading; };

  get groupElements() {
    return this.travels
      .map(elem => elem[(this.orderByControl.value).field])
      .filter((elem, index, self) => index === self.findIndex((t) => _.isEqual(t, elem))) //dédoublonne
      .sort();
  }

  orderByList: any[] = [
    {field: "travelDate", label: "Date", type: "date"},
    {field: "study", label: "Étude", type: "path", path: "label"},
    {field: "isDriver", label: "Conducteur oui/non", type: "boolean", values: {"true": 'Conducteur', "false": 'Passager'}},
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

  getTravelsByGroup(group): Travel[] { 
    return this.travels.filter((travel: Travel) => _.isEqual(travel[(this.orderByControl.value).field], group) ); 
  };

  getTravelDurationByGroup(group) { 
    const duration = this.getTravelsByGroup(group)
                          .map((travel: Travel): number => travel.duration)
                          .reduce((a, b): number => a + b, 0);
    return Math.round(duration / 60 * 100) / 100;
  };
}
