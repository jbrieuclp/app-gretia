import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Observable, of, BehaviorSubject, Subscription } from "rxjs";
import { tap, map, switchMap, distinctUntilChanged, debounceTime, filter } from "rxjs/operators";
import { Location } from '@angular/common'; 
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { GlobalsService } from '../../../../../../shared/services/globals.service';
import { SuiveuseService } from '../../suiveuse.service';
import { WorksRepository, Work } from '../../../../repository/works.repository';
import { WorkService } from '../work.service';

@Component({
  selector: 'app-projet-suiveuses-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.scss']
})
export class WorkFormComponent implements OnInit, OnDestroy {

  public form: FormGroup;
	$date: Observable<Date>
	$dateSub: Subscription;
  saving: boolean = false;

  timeForm: FormGroup;
  dureeForm: FormControl;
  optionsHour: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  optionsMinute: number[] = [0, 15, 30, 45];
  timeFormDisplay: boolean = false;

  constructor(
  	private fb: FormBuilder,
  	private location: Location,
  	private suiveuseS: SuiveuseService,
  	private workR: WorksRepository,
    private workS: WorkService,
    private globalS: GlobalsService,
  ) { 
  	this.$date = suiveuseS.selectedDate.asObservable();
  }

  ngOnInit() {
  	this.initForm();
  	this.setObservables()
  }

  private get initialValues(): any {
    const values = {
			    	estNuit: false,
      			estWe: false,
            dateTravail: moment(this.suiveuseS.selectedDate.getValue()).format('YYYY-MM-DD'),
      		};
    return values;
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      tache: [null, [Validators.required]],
      dateTravail: [null, [Validators.required]],
      temps: [null, [Validators.required, Validators.pattern('^[0-9]+\.?[0-9]*$')]],
      detail: null,
      estNuit: [null, [Validators.required]],
      estWe: [null, [Validators.required]]
    });

    /*Duree Form */
    //declaration
    this.dureeForm = new FormControl(null, [Validators.pattern('^[0-9]+\.?(25|5|75)?0?$')]);

    this.timeForm = this.fb.group({
                      heure: [null, [Validators.pattern('[0-9]+'), inArrayValidator(this.optionsHour)]],
                      minutes: [null, [Validators.pattern('[0-9]+'), inArrayValidator(this.optionsMinute)]]
                    });

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    this.$dateSub = this.$date
      .pipe(
        distinctUntilChanged(),
        tap((date) =>  this.reset()),
        map((date) => moment(date).format('YYYY-MM-DD'))
      )
      .subscribe((date: string) => this.form.get('dateTravail').setValue(date));

    //changes event
    this.dureeForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter(temps => temps !== null),
        map((temps) => temps.toString().replace(',', '.').replace(/[^\d\.]/g, '')),
      )
      .subscribe((duree: string) => this.dureeForm.setValue(duree));

    this.dureeForm.valueChanges
      .pipe(
        filter(() => this.dureeForm.valid),
        map((temps) => +(temps)*60),
        filter((temps) => this.form.get('temps').value !== temps)
      )
      .subscribe(temps => {
        this.form.get('temps').setValue(temps);
      });

    this.timeForm.valueChanges
      .pipe(
        filter(()=>this.timeForm.valid),
        map((time)=>(+(time.heure)*60) + +(time.minutes)),
        filter((temps)=>this.form.get('temps').value !== temps)
      )
      .subscribe(temps => {
        this.form.get('temps').setValue(temps);
      });

    this.form.get('temps').valueChanges
      .pipe(filter(()=>this.form.get('temps').valid))
      .subscribe(temps => {
        this.dureeForm.setValue(Math.round((+(temps)/60)*100)/100);
        this.timeForm.setValue({heure: Math.trunc(+(temps)/60), minutes: temps%60});
      });
  }

  isWeekend(date): boolean {
    return moment(date).isoWeekday() === 6 || moment(date).isoWeekday() === 7;
  }

  save() {
    this.saving = true;
		this.workR.postMyWorks(this.form.value)
			.pipe(
        tap(() => this.saving = false),
        tap(() => this.reset()),
        tap(() => this.workS.refreshWorks(this.suiveuseS.selectedDate.getValue())),
        tap((work) => console.log(this.suiveuseS.addWorkToDay(work))),
			)
      .subscribe(() => this.globalS.snackBar({msg: "Travail ajouté"}))
  }

  reset() {
    this.form.reset(this.initialValues);
    this.dureeForm.reset();
    this.timeForm.reset();
    this.form.get('estWe').setValue(this.isWeekend(this.suiveuseS.selectedDate.getValue()))
  }

  ngOnDestroy() {
  	this.$dateSub.unsubscribe();
  }

}


import {AbstractControl, ValidatorFn} from '@angular/forms';

export function inArrayValidator(comparedValues: any[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    if (control.value !== null) {
      return comparedValues.findIndex(v => v === control.value) !== -1 ? null : {'inArrayError': true};
    }

    return null;
  };
}
