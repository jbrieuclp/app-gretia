import { Component } from '@angular/core';

import { StudyManagersService } from './managers.service';

@Component({
  selector: 'app-projet-study-managers',
  templateUrl: './managers.component.html'
})
export class StudyManagersComponent {

  get managers() { return this.managersS.managers; }

  get loading() { return this.managersS.loading; }

  constructor(
    private managersS: StudyManagersService,
  ) { }

}
