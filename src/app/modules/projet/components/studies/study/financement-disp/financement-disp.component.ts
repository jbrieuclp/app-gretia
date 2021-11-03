import { Component, OnInit } from '@angular/core';
import { StudyFinancementService } from './financement.service';

@Component({
  selector: 'app-projet-study-financement',
  templateUrl: './financement-disp.component.html',
  styleUrls: ['./financement-disp.component.scss']
})
export class FinancementProjectComponent implements OnInit {

  get fundings(){
    return this.studyFinancementS.fundings;
  }

  get loading(): boolean {
    return this.studyFinancementS.loading;
  }
  
  constructor(
  	private studyFinancementS: StudyFinancementService
  ) { }

  ngOnInit() {
  }

}
