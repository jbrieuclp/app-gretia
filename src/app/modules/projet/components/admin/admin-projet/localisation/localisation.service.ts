import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { filter, tap, map, switchMap } from 'rxjs/operators';

import { StudiesRepository } from '../../../../repository/studies.repository'
import { Localisation } from '../../../../repository/project.interface'

@Injectable()
export class LocalisationService {

	public totalItems: number = 0;
  public localisations: Localisation[] = [];
	public localisationSelect: BehaviorSubject<Localisation> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;
	//gestion affichages sur pages localisations display list/form
	public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
  	private projetR: StudiesRepository
  ) { 
  	this.initForm();
  	this.setObservables();

  	this.loadLocalisations();
  }

  private get initialValues(): Localisation {
    return {};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      name: [null, Validators.required]
    });

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    this.localisationSelect.asObservable()
      .pipe(
        tap(() => {
          //On vide préalablement le FormArray //.clear() existe en angular 8
          this.reset();
        }),
        switchMap((localisation) => {
          //on oriente la source des données pour patcher le formulaire
          return localisation ? this.localisationSelect : of(this.initialValues);
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });
  }

  submit(): void {   
    this.waiting = true;
    if (this.localisationSelect.getValue()) {
      //update
      this.projetR
        .updateLocalisation(
          (this.localisationSelect.getValue()).id,
          this.form.value
        )
        .pipe(
          tap((): void => {
            this.waiting = false;
            this.reset();
            this.moveStepper(0);
            this.loadLocalisations();
          })
        )
        .subscribe(
          (localisation: Localisation) => this.localisationSelect.next(localisation),
          (err) => {
            this.waiting = false;
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
    } else {
      //create
      this.projetR
        .createLocalisation(this.form.value)
        .pipe(
          tap((): void => {
            this.waiting = false;
            this.reset();
            this.moveStepper(0);
            this.loadLocalisations();
          })
        )
        .subscribe(
          (localisation: Localisation) => this.localisationSelect.next(localisation),
          (err) => {
            this.waiting = false;
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
    }
  }

  delete(item: Localisation): void {
    const idx = this.localisations.findIndex((localisation)=>localisation.id == item.id);
    if (idx > -1) {
      this.projetR.deleteLocalisation(item.id)
        .pipe(
          tap(()=>this.localisationSelect.next(null))
        )
        .subscribe(data => this.localisations.splice(idx, 1));
    }
  }

  loadLocalisations() {
    this.projetR.localisations()
      .pipe(
        tap((data: any)=>this.totalItems = data["hydra:totalItems"]),
        map((data: any): Localisation[]=>data["hydra:member"])
      )
      .subscribe(
        (localisations: Localisation[]) => this.localisations = localisations
      );
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
	}

  reset() {
    this.form.reset(this.initialValues);
  }
}
