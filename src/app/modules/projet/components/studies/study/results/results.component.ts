import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { Action, Study, Charge, StudyFunding } from '../../../../repository/project.interface';
import { StudyActionsService } from '../actions/actions.service';
import { StudyService } from '../study.service';
import { StudyChargesService } from '../charges/charges.service';
import { StudyFundingsService } from '../fundings/fundings.service';
import { SuiveuseRepository } from '../../../../repository/suiveuse.repository';

@Component({
  selector: 'app-project-study-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class StudyResultsComponent implements OnInit {

  get study(): Study { return this.studyS.study.getValue(); };
  get actions(): Action[] { return this.actionsS.actions.getValue(); };
  get charges(): Charge[] { return this.chargesS.charges.getValue(); };
  get fundings(): StudyFunding[] { return this.fundingS.fundings.getValue(); };

  form: FormGroup;
  waiting: boolean = false;
  data: any;

  constructor(
    private fb: FormBuilder,
    private studyS: StudyService,
    private actionsS: StudyActionsService,
    private chargesS: StudyChargesService,
    private fundingS: StudyFundingsService,
    private suiveuseR: SuiveuseRepository
  ) { 
    moment.locale('fr');
  }

  ngOnInit() {
    this.form = this.fb.group({
      start: [moment([moment().year(), 3]).format('YYYY-MM-DD'), Validators.required],
      end: [moment([moment().year() + 1, 2]).endOf('month').format('YYYY-MM-DD'), Validators.required]
    });
  }

  getWorks() {
    this.waiting = true;
    this.suiveuseR.cumulative({
      "startAt": moment(this.form.get('start').value).format('YYYY-MM-DD'), 
      "endAt": moment(this.form.get('end').value).format('YYYY-MM-DD')
    })
      .pipe(
        tap(() => this.waiting = false),
      )
      .subscribe(res => this.data = res);
  }

}
