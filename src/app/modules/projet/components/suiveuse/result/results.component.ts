import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { WorkingTimeResultsService } from './results.service';
import { Work } from '@projet/repository/project.interface';

@Component({
  selector: 'app-projet-works-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class WorkingTimeResultsComponent implements OnInit {

  get works() { return this.workingTimeResultsS.works; };
  get travels() { return this.workingTimeResultsS.travels; };
  get expenses() { return this.workingTimeResultsS.expenses; };
  
  constructor(
    private workingTimeResultsS: WorkingTimeResultsService,
  ) { }

  ngOnInit() {}

}
