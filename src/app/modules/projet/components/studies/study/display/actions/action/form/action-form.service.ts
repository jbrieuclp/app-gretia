import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { filter, tap, map, switchMap, startWith, distinctUntilChanged } from 'rxjs/operators';

import { ActionsRepository } from '@projet/repository/actions.repository';
import { Study, Charge, Action } from '@projet/repository/project.interface';
import { StudyService } from '../../../../study.service';
import { ActionService } from '../action.service';
import { StudyActionsService } from '../../actions.service';

@Injectable()
export class ActionFormService {

	public form: FormGroup;
  public waiting: boolean = false;
  public $study: BehaviorSubject<Study>;
  public stepper: MatStepper;

  get study() {
    return this.studyS.study.getValue();
  }

  get action() {
    return this.actionS.action.getValue();
  }

  constructor(
  	private fb: FormBuilder,
    private actionR: ActionsRepository,
    private studyS: StudyService,
    private actionS: ActionService,
    private studyActionsS: StudyActionsService,
  ) {
    this.initForm();
    this.setObservables();
  }

  private get initialValues(): any {
    return {};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      label: [null, Validators.required],
      objective: [null],
      study: [null, Validators.required],
      nbOfDays: [null, [Validators.required, Validators.min(0)]],
      description: [null],
    });
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    this.studyS.study.asObservable()
      .pipe(
        filter(study => study !== null && this.action === null)
      )
      .subscribe(study => this.form.get('study').setValue(study['@id']));

    this.actionS.action.asObservable()
      .pipe(
        map((action: Action): Action => action !== null ? action : this.initialValues)
      )
      .subscribe((action: Action) => this.form.patchValue(action));
  }

  reset() {
    this.form.reset(this.initialValues);
  }

  submit(): Observable<any> {   
    this.waiting = true;

    let api;
    if (this.action) {
      //update
      api = this.actionR.patch(
              this.action['@id'],
              this.form.value
            )
              .pipe(
                map((action: Action): Action => Object.assign(this.action, action)),
              );
    } else {
      //create
       api = this.actionR.createAction(this.form.value)
              .pipe(
                tap((action: Action) => this.studyActionsS.actions.getValue().push(action)),
                tap((action: Action) => this.actionS.action.next(action)),
              );
    }

    return api
      .pipe(
        tap((): void => {
          this.waiting = false;
          this.actionS.displayActionForm = false;
        }),
      );
  }
}
