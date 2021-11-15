import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SelectControl } from '../select-control/select.control';
import { ChargeTypeRepository } from '../../repository/charge-type.repository';
import { ChargeType } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-charge-type',
  templateUrl: '../select-control/select.control.html'
})
export class ChargeTypeControlComponent extends SelectControl implements OnInit {

  label = "Type de charge";
  loading: boolean = false;
  optionDisplayFn = (option) => option.label;
  value = (option) => option['@id'];

  constructor(
    private chargeTypeR: ChargeTypeRepository
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getChargeTypes();
  }

  getChargeTypes() {
    this.loading = true;
    this.chargeTypeR.chargeTypes()
      .pipe(
        map((data: any): ChargeType[]=>data["hydra:member"]),
        tap(() => this.loading = false)
      )
      .subscribe((chargeTypes:ChargeType[]) => this.options = chargeTypes);
  }
}