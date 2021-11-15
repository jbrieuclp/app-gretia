import { Component, OnInit } from '@angular/core';

import { Action, Study, Charge } from '../../../../repository/project.interface';
import { StudyActionsService } from '../actions/actions.service';
import { StudyService } from '../study.service';
import { StudyChargesService } from '../charges/charges.service';

@Component({
  selector: 'app-project-study-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class StudyResultsComponent implements OnInit {

  get study(): Study { return this.studyS.study.getValue(); };
  get actions(): Action[] { return this.actionsS.actions.getValue(); };
  get charges(): Charge[] { return this.chargesS.charges.getValue(); };

  constructor(
    private studyS: StudyService,
    private actionsS: StudyActionsService,
    private chargesS: StudyChargesService,
  ) { }

  ngOnInit() {
  }

}
