import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Subscription } from 'rxjs';
import { filter, tap, map, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';

import * as moment from 'moment';

@Component({ template: '' })
export class AbstractControl implements OnInit, OnDestroy {

  @Input() form: FormControl;
  private _required: boolean = false;
  @Input() set required(val: any) { this._required = ((val.toString()).toLowerCase() === 'false' ? false : true); };
  get required() { return this._required };

  @Input() appearance: string = 'legacy';
  @Input() placeholder: string = '';
  loading: boolean = false;
  //options désactivées
  @Input() optionsDisabled: any[] = [];

  @Output() changeEvent = new EventEmitter<any>();
  
  _subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
    if (this.form === undefined) {
      throw 'input form is not defined';
    }

    if ( this.form.value !== null && typeof this.form.value === 'object' && this.form.value['@id'] !== undefined) {
      this.form.setValue(this.form.value['@id'], {emitEvent: false})
    }

    this._subscriptions.push(
      this.form.valueChanges
        .pipe(
          filter((val: any) => val !== null && typeof val === 'object' && val['@id'] !== undefined),
          map((val: any): string => val['@id']),
        )
        .subscribe(val => this.form.setValue(val, {emitEvent: false}))
    );
  }

  isDisabled(option): boolean {
    return this.optionsDisabled.findIndex(e => e['@id'] === option['@id']) !== -1;
  }

  changeEmit(value: any) {
    this.changeEvent.emit(value);
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

}
