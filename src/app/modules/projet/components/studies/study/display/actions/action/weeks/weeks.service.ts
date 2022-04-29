import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Week } from '@projet/repository/project.interface';

@Injectable()
export class WeeksService {

  week: BehaviorSubject<Week> = new BehaviorSubject(null);
  weekTooltip: string;

  constructor() { }

}
