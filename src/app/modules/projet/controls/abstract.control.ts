import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { filter, tap, map, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';

import * as moment from 'moment';

@Component({ template: '' })
export class AbstractControl implements OnInit, OnDestroy {

  @Input() form: FormControl;
  private _required: boolean = false;
  @Input() set required(val: any) { this._required = (val.toLowerCase() === 'false' ? false : true); };
  get required() { return this._required };
  @Input() appearance: string = 'legacy';
  loading: boolean = false;
  //options désactivées
  @Input() optionsDisabled: any[] = [];
  
  _subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
    if (this.form === undefined) {
      throw 'input form is not defined';
    }

    if ( this.form.value !== null && typeof this.form.value === 'object' && this.form.value['@id'] !== undefined) {
      this.form.setValue(this.form.value['@id'])
    }

    this.form.valueChanges
      .pipe(
        filter((val: any) => val !== null && typeof val === 'object' && val['@id'] !== undefined),
        map((val: any): string => val['@id'])
      )
      .subscribe(val => this.form.setValue(val));
  }

  isDisabled(option): boolean {
    return this.optionsDisabled.findIndex(e => e['@id'] === option['@id']) !== -1;
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

}
