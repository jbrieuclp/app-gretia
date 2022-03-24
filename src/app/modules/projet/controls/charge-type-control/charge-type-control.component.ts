import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { AbstractControl } from '../abstract.control';
import { ChargeType } from '../../repository/project.interface';
import { ChargeTypeRepository } from '../../repository/charge-type.repository';

@Component({
  selector: 'app-projet-control-charge-type',
  templateUrl: '../autocomplete-control/autocomplete.template.html'
})
export class ChargeTypeControlComponent extends AbstractControl implements OnInit, OnDestroy {

  label = "Type de charge";
  optionDisplayFn = (option) => option.label;
  value = (option) => option['@id'];
  options: any[] = [];
  private _clearable: boolean = true;
  @Input() set clearable(val: any) { this._clearable = ((val.toString()).toLowerCase() === 'false' ? false : true); };
  get clearable() { return this._clearable };

  constructor(
    private chargeTypeR: ChargeTypeRepository
  ) {
    super();
  }

  ngOnInit() {

    super.ngOnInit();

    this.getChargeTypes()
      .subscribe((chargeTypes:ChargeType[]) => this.options = chargeTypes);

    this._subscriptions.push(
      this.form.valueChanges
      .pipe(
        map(val => this.options.find(item => this.value(item) === val))
      )
      .subscribe(val => this.changeEmit(val))
    );
  }

  getChargeTypes() {
    this.loading = true;

    return this.chargeTypeR.chargeTypes()
      .pipe(
        map((data: any): ChargeType[] => data["hydra:member"]),
        tap(() => this.loading = false),
        map((chargeTypes: ChargeType[]) => chargeTypes.sort((a, b)=> a.orderBy - b.orderBy))
      );
      
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}