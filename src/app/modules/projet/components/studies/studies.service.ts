import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { filter, tap, map, switchMap } from 'rxjs/operators';

import { StudiesRepository } from '../../repository/studies.repository';
import { Study } from '../../repository/project.interface';

@Injectable()
export class StudiesService {

  public totalItems: number = 0;
	public studies: Study[] = [];
	public studySelect: BehaviorSubject<Study> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;
	//gestion affichages sur pages studies display list/form
	public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
  	private studiesR: StudiesRepository,
  ) { 
  	this.initForm();
  	this.setObservables();

  	this.loadStudys();
  }

  private get initialValues(): Study {
    return {};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      code: [null, Validators.required],
      label: [null, Validators.required],
      objectif: [null],
      dateStart: [null, Validators.required],
      dateEnd: [null],
      projectType: [null, Validators.required],
      localisations: this.fb.array([], Validators.required),
      managers: this.fb.array([], Validators.required),
    //  taches: this.fb.array([], Validators.required)
    });

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    this.studySelect.asObservable()
      .pipe(
        tap(() => {
          //On vide préalablement le FormArray //.clear() existe en angular 8
          this.reset();
        }),
        switchMap((study: Study) => {
          //on oriente la source des données pour patcher le formulaire
          return study ? this.studySelect : of(this.initialValues);
        }),
        tap((study: Study) => {
          //mise en place des salarieForm
          if (study.id === undefined) {
            this.addManager();
            this.addLocalisation();
          } else {
            study.managers.forEach((e, i)=>{
              this.addManager();
            });
            study.localisations.forEach((e, i)=>{
              this.addLocalisation();
            });
          }
        })
      )
      .subscribe((values) => this.form.patchValue(values));
  }

  submit(): void { 	
    this.waiting = true;
    console.log(this.form)
    if (this.studySelect.getValue()) {
      // //update
      // this.studyR
      //   .updateStudy(
      //     (this.studySelect.getValue()).id,
      //     this.form.value
      //   )
      //   .pipe(
      //   	tap((): void => {
	     //    	this.waiting = false;
	     //    	this.reset();
      //       this.moveStepper(0);
      //       this.loadStudys();
	     //    })
	     //  )
      //   .subscribe(
      //     (study: Study) => this.studySelect.next(study),
      //     (err) => {
      //       this.waiting = false;
      //       //this._commonService.translateToaster("error", "ErrorMessage");
      //     }
        // );
    } else {
      //create
      this.studiesR
        .createStudy(this.form.value)
        .pipe(
        	tap((): void => {
        		this.waiting = false;
            this.reset();
            this.moveStepper(0);
            this.loadStudys();
        	})
        )
        .subscribe(
          (study: Study) => this.studySelect.next(study),
          (err) => {
            this.waiting = false;
            //this._commonService.translateToaster("error", "ErrorMessage");
          }
        );
    }
  }

  delete(item: Study): void {
  	const idx = this.studies.findIndex((study)=>study.id == item.id);
    if (idx > -1) {
    	// this.studyR.deleteStudy(item.id)
     //    .pipe(
     //      tap(()=>this.studySelect.next(null))
     //    )
    	// 	.subscribe(data => this.studies.splice(idx, 1));
    }
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
	}

  reset() {
    this.form.reset(this.initialValues);
    this.clearFormArray(this.form.get("managers") as FormArray);
    this.clearFormArray(this.form.get("localisations") as FormArray);
  }

  get managers(): FormArray {
    return this.form.get("managers") as FormArray;
  }

  addManager(value = null): void {
    this.managers.push(new FormControl(null, [Validators.required]));
  }

  removeManager(i: number): void {
    this.managers.removeAt(i);;
  }

  get localisations(): FormArray {
    return this.form.get("localisations") as FormArray;
  }

  addLocalisation(value = null): void {
    this.localisations.push(new FormControl(value, [Validators.required]));
  }

  removeLocalisation(i: number): void {
    this.localisations.removeAt(i);;
  }



  loadStudys() {
    this.studiesR.studies()
      .pipe(
        tap((data: any)=>this.totalItems = data["hydra:totalItems"]),
        map((data: any): Study[]=>data["hydra:member"])
      )
      .subscribe(
        (studies: Study[]) => this.studies = studies
      );
  }

  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
}
