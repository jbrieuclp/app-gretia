import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { filter, tap, map, switchMap } from 'rxjs/operators';

import { ActionsRepository } from '../../../../repository/actions.repository'
import { ActionCategory } from '../../../../repository/project.interface'

@Injectable()
export class ActionCategoriesService {

	public totalItems: number = 0;
  public actionCategories: ActionCategory[] = [];
	public itemSelected: BehaviorSubject<ActionCategory> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;
	//gestion affichages sur pages actions display list/form
	public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
  	private actionR: ActionsRepository
  ) { 
  	this.initForm();
  	this.setObservables();

  	this.loadActionCategories();
  }

  private get initialValues(): ActionCategory {
    return {
      orderBy: this.totalItems + 1
    };
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      label: [null, Validators.required],
      description: [null],
      orderBy: [null, Validators.required],
    });

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    this.itemSelected.asObservable()
      .pipe(
        tap(() => {
          //On vide préalablement le FormArray //.clear() existe en angular 8
          this.reset();
        }),
        switchMap((action) => {
          //on oriente la source des données pour patcher le formulaire
          return action ? this.itemSelected : of(this.initialValues);
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });
  }

  submit(): void {   
    this.waiting = true;
    if (this.itemSelected.getValue()) {
      //update
      this.actionR
        .patch(
          (this.itemSelected.getValue())['@id'],
          this.form.value
        )
        .pipe(
          tap((): void => {
            this.waiting = false;
            this.reset();
            this.moveStepper(0);
            this.loadActionCategories();
          })
        )
        .subscribe(
          (action: ActionCategory) => this.itemSelected.next(action),
          (err) => {
            this.waiting = false;
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
    } else {
      //create
      this.actionR
        .createAction(this.form.value)
        .pipe(
          tap((): void => {
            this.waiting = false;
            this.reset();
            this.moveStepper(0);
            this.loadActionCategories();
          })
        )
        .subscribe(
          (action: ActionCategory) => this.itemSelected.next(action),
          (err) => {
            this.waiting = false;
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
    }
  }

  delete(item: ActionCategory): void {
    this.actionR.delete(item['@id'])
      .pipe(
        tap(()=>this.itemSelected.next(null))
      )
      .subscribe(() => this.loadActionCategories());
  }

  loadActionCategories() {
    this.actionR.actionCategories()
      .pipe(
        tap((data: any)=>this.totalItems = data["hydra:totalItems"]),
        map((data: any): ActionCategory[]=>data["hydra:member"])
      )
      .subscribe(
        (actionCategories: ActionCategory[]) => this.actionCategories = actionCategories
      );
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
	}

  reset() {
    this.form.reset(this.initialValues);
  }
}
