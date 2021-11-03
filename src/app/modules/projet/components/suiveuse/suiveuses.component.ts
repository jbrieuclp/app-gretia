import { Component } from '@angular/core';

import { SuiveuseService } from './suiveuse.service';
import { SuiveuseRepository } from '../../repository/suiveuse.repository';

@Component({
  selector: 'app-projet-suiveuses',
  templateUrl: './suiveuses.component.html',
  styleUrls: ['./suiveuses.component.scss']
})
export class SuiveusesComponent {

	/* Date selectionnée sur le calendrier */
  get selectedDate() {
    return this.suiveuseS.selectedDate;
  }

  constructor(
  	private suiveuseS: SuiveuseService,
    private suiveuseR: SuiveuseRepository,
  ) { 
    this.suiveuseR.calculateRecup()
      .subscribe(res => console.log(res));
  }
}
