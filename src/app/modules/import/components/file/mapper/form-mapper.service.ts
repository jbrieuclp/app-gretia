import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { ImportService } from '../../../services/import.service';

@Injectable()
export class FormMapperService {

  fsdValues: BehaviorSubject<any[]> = new BehaviorSubject([]);

	constructor(private importS: ImportService) { 
    this.getFSDValue();
  }

  getFSDValue() {
    this.importS.getFSDFields()
      .pipe(
        map((res) => res['hydra:member'])
      )
      .subscribe(
        (fsds: any) => this.fsdValues.next(fsds),
        error => { /*this.errors = error.error;*/ }
      );
  }

}