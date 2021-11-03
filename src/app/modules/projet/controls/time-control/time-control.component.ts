import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl, ValidatorFn } from "@angular/forms";
import { Subscription } from "rxjs";
import { tap, map, switchMap, distinctUntilChanged, debounceTime, filter } from "rxjs/operators";

import { AbstractControl as HomeAbstractControl} from '../abstract.control';

@Component({
  selector: 'app-projet-time-control',
  templateUrl: './time-control.component.html',
  styleUrls: ['./time-control.component.scss']
})
export class TimeControlComponent extends HomeAbstractControl implements OnInit, OnDestroy {

  timeForm: FormGroup;
  durationForm: FormControl;
  optionsHour: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  optionsMinute: number[] = [0, 15, 30, 45];
  timeFormDisplay: boolean = false;

  _subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
  ) { 
    super(); 
  }

  ngOnInit() {
    this.initForm();
    this.setObservables();

    this.setTimeValue(this.form.value);
  }

  initForm(): void {
    /*Duree Form */
    //declaration
    this.durationForm = new FormControl(null, [Validators.pattern('^[0-9]+\.?(25|5|75)?0?$')]);

    this.timeForm = this.fb.group({
                      hour: [null, [Validators.pattern('[0-9]+'), inArrayValidator(this.optionsHour)]],
                      minute: [null, [Validators.pattern('[0-9]+'), inArrayValidator(this.optionsMinute)]]
                    });
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //changes event
    this._subscriptions.push(
      this.durationForm.valueChanges
        .pipe(
          distinctUntilChanged(),
          filter(duration => duration !== null),
          map((duration) => duration.toString().replace(',', '.').replace(/[^\d\.]/g, '')),
        )
        .subscribe((duration: string) => this.durationForm.setValue(duration))
    );

    this._subscriptions.push(
      this.durationForm.valueChanges
        .pipe(
          filter(() => this.durationForm.valid),
          map((duration) => +(duration)*60),
          filter((duration) => this.form.value !== duration)
        )
        .subscribe(duration => {
          this.form.setValue(duration);
        })
    );

    this._subscriptions.push(
      this.timeForm.valueChanges
        .pipe(
          filter(()=>this.timeForm.valid),
          map((time)=>(+(time.hour)*60) + +(time.minute)),
          filter((duration)=>this.form.value !== duration)
        )
        .subscribe(duration => {
          this.form.setValue(duration);
        })
    );

    this._subscriptions.push(
      this.form.valueChanges
        .pipe(
          filter(()=>this.form.valid))
        .subscribe(duration => this.setTimeValue(duration))
    );

    //suivi des action après un reset de this.form
    this._subscriptions.push(
      this.form.valueChanges
        .pipe(
          filter((val) => val === null)
        )
        .subscribe(duration => {
          this.durationForm.reset();
          this.timeForm.reset();
        })
    );
  }

  private setTimeValue(duration) {
    this.durationForm.setValue(Math.round((+(duration)/60)*100)/100);
    this.timeForm.setValue({hour: Math.trunc(+(duration)/60), minute: duration%60});
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }
}


export function inArrayValidator(comparedValues: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (control.value !== null) {
      return comparedValues.findIndex(v => v === control.value) !== -1 ? null : {'inArrayError': true};
    }

    return null;
  };
}