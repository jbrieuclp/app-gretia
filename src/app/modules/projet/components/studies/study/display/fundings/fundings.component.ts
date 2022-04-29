import { Component, OnInit } from '@angular/core';
import { StudyFundingsService } from './fundings.service';

import { StudyService } from '../../study.service';

@Component({
  selector: 'app-projet-study-fundings',
  templateUrl: './fundings.component.html',
  styleUrls: ['./fundings.component.scss']
})
export class StudyFundingsComponent implements OnInit {

  get fundings(){ return this.studyFundingsS.fundings.getValue(); }

  get loading(): boolean { return !(!this.studyFundingsS.loading && !this.studyS.loadingStudy); }; //chargement du study
  
  constructor(
  	private studyFundingsS: StudyFundingsService,
    private studyS: StudyService,
  ) { }

  ngOnInit() {
  }

}
