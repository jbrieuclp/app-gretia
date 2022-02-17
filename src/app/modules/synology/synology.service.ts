import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Injectable()
export class SynologyService {

  public _sid: BehaviorSubject<string> = new BehaviorSubject(null);
  set sid(value) { this._sid.next(value); };
  get sid() { return this._sid.value; };
  get $sid() { return this._sid; };

  public _user: BehaviorSubject<string> = new BehaviorSubject('');
  set user(value) { this._user.next(value); };
  get user() { return this._user.value; };
  get $user() { return this._user; };

  constructor(

  ) { 
    this.setObservables();
  }

  private setObservables() {
    
  }

}
