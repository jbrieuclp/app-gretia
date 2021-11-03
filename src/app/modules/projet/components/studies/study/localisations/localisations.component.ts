import { Component } from '@angular/core';

import { StudyLocalisationsService } from './localisations.service';

@Component({
  selector: 'app-projet-study-localisations',
  templateUrl: './localisations.component.html',
  styleUrls: ['./localisations.component.scss']
})
export class StudyLocalisationsComponent {

  get localisations() { return this.localisationsS.localisations; }

  get loading() { return this.localisationsS.loading; }

  constructor(
    private localisationsS: StudyLocalisationsService,
  ) { }

}
