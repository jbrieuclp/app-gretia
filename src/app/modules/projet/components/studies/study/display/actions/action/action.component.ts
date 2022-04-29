import { Component } from '@angular/core';

import { ActionService } from './action.service';
import { Action } from '@projet/repository/project.interface';

@Component({
  selector: 'app-projet-study-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.scss']
})
export class ActionComponent {

  get action() { return this.actionS.action; }
  
  get loading() { return this.actionS.loading; }

  constructor(
    private actionS: ActionService,
  ) { }
}
