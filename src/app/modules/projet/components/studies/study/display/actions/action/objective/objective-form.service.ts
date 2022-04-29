import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { filter, tap, map, switchMap, startWith, distinctUntilChanged } from 'rxjs/operators';

import { ActionsRepository } from '@projet/repository/actions.repository';
import { Study, Charge, Action, Objective } from '@projet/repository/project.interface';
import { StudyService } from '../../../../study.service';
import { ActionService } from '../action.service';
import { StudyActionsService } from '../../actions.service';

@Injectable()
export class ObjectiveFormService {

	public objective: BehaviorSubject<Objective> = new BehaviorSubject(null);
  public form: FormGroup;
  public waiting: boolean = false;

  get study() { return this.studyS.study.getValue(); }

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

  private get initialValues(): Objective {
    return {study: this.study['@id']};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      code: [null],
      label: [null, Validators.required],
      study: [null, Validators.required],
    });
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    this.objective.asObservable()
      .pipe(
        map((objective: Objective): Objective => objective !== null ? objective : this.initialValues)
      )
      .subscribe((action: Action) => this.form.patchValue(action));
  }

  reset() {
    this.form.reset(this.initialValues);
  }

  // submit(): Observable<any> {   
  //   this.waiting = true;

  //   let api;
  //   if (this.action) {
  //     //update
  //     api = this.actionR.patch(
  //             this.action['@id'],
  //             this.form.value
  //           )
  //             .pipe(
  //               map((action: Action): Action => Object.assign(this.action, action)),
  //             );
  //   } else {
  //     //create
  //      api = this.actionR.createAction(this.form.value)
  //             .pipe(
  //               tap((action: Action) => this.studyActionsS.actions.getValue().push(action)),
  //               tap((action: Action) => this.actionS.action.next(action)),
  //             );
  //   }

  //   return api
  //     .pipe(
  //       tap((): void => {
  //         this.waiting = false;
  //         this.actionS.displayActionForm = false;
  //       }),
  //     );
  // }
}
