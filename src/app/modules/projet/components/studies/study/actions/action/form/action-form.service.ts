import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Observable, of, combineLatest } from 'rxjs';
import { filter, tap, map, switchMap, startWith, distinctUntilChanged } from 'rxjs/operators';

import { ActionsRepository } from '../../../../../../repository/actions.repository';
import { Study, Charge, Action } from '../../../../../../repository/project.interface';
import { StudyService } from '../../../study.service';
import { ActionService } from '../action.service';
import { StudyActionsService } from '../../actions.service';
import { StudyMontagesService } from '../../../montages/montages.service';

@Injectable()
export class ActionFormService {

	public form: FormGroup;
  public waiting: boolean = false;
  public $study: BehaviorSubject<Study>;
  public stepper: MatStepper;
  public availableDays: number = 0;

  get study() {
    return this.studyS.study.getValue();
  }

  constructor(
  	private fb: FormBuilder,
    private actionR: ActionsRepository,
    private studyS: StudyService,
    private actionS: ActionService,
    private studyActionsS: StudyActionsService,
    private studyMontagesS: StudyMontagesService,
  ) {
    console.log("ici");
    this.initForm();
    this.setObservables();
  }

  private get initialValues(): any {
    return {};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      charge: [null, Validators.required],
      study: [null, Validators.required],
      nbOfDays: [null, [Validators.required, Validators.min(0)]],
      category: [null, [Validators.required/*, Validators.min()*/]],
      objectif: [null],
    });

    
  }

  public patchForm() {
    if (this.actionS.action === null) {
      this.form.patchValue(this.initialValues);
    } else {
      let action = Object.assign({}, this.actionS.action);
      if (action.charge !== null && typeof action.charge === 'object' && action.charge['@id'] !== undefined) {
        action.charge = action.charge['@id'];
      }

      if (action.category !== null && typeof action.category === 'object' && action.category['@id'] !== undefined) {
        action.category = action.category['@id'];
      }
      console.log(this.actionS.action, action)
      this.form.patchValue(action);
    }
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    this.studyS.study.asObservable()
      .pipe(
        filter(study => study !== null)
      )
      .subscribe(study => this.form.get('study').setValue(study['@id']));


    //permet de déterminer le nombre de jours encore affectable à l'action selon la charge selectionnée
    combineLatest(
      combineLatest( //transform @id of charge to charge object
        this.form.get('charge').valueChanges
          .pipe(
            startWith(this.form.get('charge').value)
          ),
        this.studyMontagesS.charges.asObservable()
          .pipe(
            map(charges => charges.filter(item => item.chargeType.chargeTypeRef.isPerDay === true)),
            filter(charges => charges.length > 0)
          )
      )
        .pipe(
          tap(() => this.form.get('nbOfDays').setValidators([Validators.required, Validators.min(0)])),
          map(([charge, charges]): Charge => charges.find(c => c['@id'] == charge)),
          filter((charge: Charge) => charge !== undefined)
        ),
      this.studyActionsS.actions.asObservable()
        .pipe(
          map(actions => actions.filter(item => item.charge !== null))
        ),
      this.form.get('nbOfDays').valueChanges
        .pipe(
          distinctUntilChanged()
        )
    )
      .pipe(
        map(([charge, actions, inputValue]) => 
          //retourne un tableau [quantité de jour pour la charge, jour déjà flichés]
          [
            charge.quantity,
            //on filtre les actions uniquement associées à la charge selectionnée
            //le map et le reduce permettent d'additionner le nombre de jour affecté cumulé
            actions.filter(item => item.charge['@id'] === charge['@id'] && item['@id'] !== this.actionS.action['@id'])
            .map(item => item.nbOfDays)
            .reduce((a, b) => a + b, 0)
          ]
        ),
        map(([dispDay, usedDays]) => dispDay - usedDays),
        tap((availableDays) => this.form.get('nbOfDays').setValidators([Validators.required, Validators.min(0), Validators.max(availableDays)])),
        tap(() => {
          this.form.get('nbOfDays').updateValueAndValidity()
          this.form.get('nbOfDays').markAsDirty()
        })
      )
      .subscribe((availableDays) => this.availableDays = availableDays);

    // //patch le form par les valeurs par defaut si creation
    // this.actionS.action.asObservable()
    //   .pipe(
    //     tap(() => {
    //       //On vide préalablement le FormArray //.clear() existe en angular 8
    //       this.reset();
    //     }),
    //     switchMap((action: Action) => {
    //       //on oriente la source des données pour patcher le formulaire
    //       return action ? this.actionS.action : of(this.initialValues);
    //     }),
    //     map((action: Action): any => {
    //       let values = Object.assign({}, action);
    //       values.charge = (values.charge === null || values.charge === undefined) ? null : values.charge['@id'];
    //       values.avancement = (values.avancement === null || values.avancement === undefined) ? null : values.avancement['@id'];
    //       return values;
    //     })
    //   )
    //   .subscribe((values) => this.form.patchValue(values));

  }

  reset() {
    this.form.reset(this.initialValues);
  }

  submit(): Observable<any> {   
    this.waiting = true;

    let api;
    if (this.actionS.action) {
      //update
      api = this.actionR.patch(
              this.actionS.action['@id'],
              this.form.value
            );
    } else {
      //create
       api = this.actionR.createAction(this.form.value);
    }

    return api
      .pipe(
        //TODO (err) => this.waiting = false;
        tap((action: Action) => this.actionS.action = action),
        switchMap(() => this.studyActionsS.getActions(this.study.id)),
        tap((): void => {
          this.waiting = false;
          this.actionS.displayActionForm = false;
        }),
        tap((actions: Action[]) => this.studyActionsS.actions.next(actions))
      );
  }
}
