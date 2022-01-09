import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ChargeTypeRepository } from '../../repository/charge-type.repository';
import { ChargeType } from '../../repository/project.interface';

@Injectable()
export class ChargeTypeControlService {

	options: BehaviorSubject<ChargeType[]> = new BehaviorSubject([]);
  loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
  	private chargeTypeR: ChargeTypeRepository
  ) { 
  	this.getChargeTypes();
  }

  getChargeTypes() {
    this.loading.next(true);
    this.chargeTypeR.chargeTypes()
      .pipe(
        map((data: any): ChargeType[]=>data["hydra:member"]),
        tap(() => this.loading.next(false))
      )
      .subscribe((chargeTypes:ChargeType[]) => this.options.next(chargeTypes));
  }

}
