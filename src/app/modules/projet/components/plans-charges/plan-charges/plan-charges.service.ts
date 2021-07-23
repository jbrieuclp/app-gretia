import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { Personne } from '../../../repository/salarie.repository';
import { Projet } from '../../../repository/projet.repository';

@Injectable({
  providedIn: 'root'
})
export class PlanChargesService {

  year: BehaviorSubject<number> = new BehaviorSubject(moment().year());
  person: BehaviorSubject<Personne> = new BehaviorSubject(null);
  openDays: BehaviorSubject<number> = new BehaviorSubject(null);
  notWorked: BehaviorSubject<number> = new BehaviorSubject(null);
  weekends: BehaviorSubject<number> = new BehaviorSubject(null);
  projects: BehaviorSubject<Projet[]> = new BehaviorSubject(null);

  constructor() { 
    this.setObservables();
  }

  setObservables() {
    
  }
}
