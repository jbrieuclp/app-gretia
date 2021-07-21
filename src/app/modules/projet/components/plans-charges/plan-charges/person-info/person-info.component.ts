import { Component, OnInit } from '@angular/core';

import { PlanChargesService } from '../plan-charges.service';

@Component({
  selector: 'app-project-pdc-person-info',
  templateUrl: './person-info.component.html',
  styleUrls: ['./person-info.component.scss']
})
export class PDCPersonInfoComponent implements OnInit {

  constructor(
    private planChargesS: PlanChargesService, 
  ) { }

  ngOnInit() {
    this.planChargesS.person.asObservable()
      .pipe(

      ).subscribe(res => {return;});
  }

}
