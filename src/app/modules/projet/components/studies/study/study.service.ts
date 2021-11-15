import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, Observable, throwError } from 'rxjs';
import { filter, tap, map, switchMap, skip, catchError, distinctUntilChanged } from 'rxjs/operators';

import { StudiesRepository } from '../../../repository/studies.repository';
import { Employee, Action, Study, Charge, Project } from '../../../repository/project.interface';

@Injectable()
export class StudyService {

	public study_id: BehaviorSubject<number> = new BehaviorSubject(null);

  public study: BehaviorSubject<Study> = new BehaviorSubject(null);
  public project: BehaviorSubject<Project> = new BehaviorSubject(null);
  public loadingStudy: boolean = false; //chargement du projet

 //  //actions
 //  public actions: BehaviorSubject<Action[]> = new BehaviorSubject([null]);
 //  public loadingActions: boolean = false;

 //  //charges
 //  public charges: BehaviorSubject<Charge[]> = new BehaviorSubject([null]);
 //  public loadingCharges: boolean = false;

	// public form: FormGroup;
	// public waiting: boolean = false;

 //  //switch entre l'affichage du formulaire et de la fiche
 //  public displayForm: boolean = false;

  constructor(
  	// private fb: FormBuilder,
   //  private _snackBar: MatSnackBar,
  	// private studyTypeR: StudyTypeRepository,
    private studiesR: StudiesRepository,
  ) { 
  	// this.initForm();
  	this.setObservables();
  }

  getStudy(id): Observable<Study> {
    this.loadingStudy = true;
    return this.studiesR.study(id)
      .pipe(
        tap(() => this.loadingStudy = false),
        catchError(err => {
            console.log('caught mapping error and rethrowing', err);
            return throwError(err);
        })
      )
  }

  // private get initialValues(): Projet {
  //   return {};
  // }

  // initForm(): void {
  //   //FORM
  //   this.form = this.fb.group({
  //     code: [null, Validators.required],
  //     intitule: [null, Validators.required],
  //     objectif: [null],
  //     dateDebut: [null, Validators.required],
  //     dateFin: [null],
  //     groupeTaxo: [null],
  //     milieu: [null],
  //     studyType: [null, [], [dateStudyTypeAsyncValidator('dateDebut', this.studyTypeR)]],
  //     localisations: this.fb.array([], Validators.required),
  //     responsables: this.fb.array([], Validators.required),
  //   });

  //   this.form.patchValue(this.initialValues);
  // }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {
    //recuperation des info du projet à partir de l'ID de l'URL
    this.study_id.asObservable()
      .pipe(
        filter((id) => id !== null),
        distinctUntilChanged(),
        filter((id) => this.study.getValue() === null || id !== this.study.getValue().id),
        switchMap((id: number) => this.getStudy(id)),
      )
      .subscribe((study: Study) => this.study.next(study));


  //   this.form.get('dateDebut').valueChanges
  //     .subscribe(() => this.form.get('studyType').updateValueAndValidity())

  //   //patch le form par les valeurs par defaut si creation
  //   this.projet.asObservable()
  //     .pipe(
  //       filter((projet: Projet) => projet !== null),
  //       switchMap((projet: Projet): Observable<Projet> => this.setForm(projet))
  //     )
  //     .subscribe((values) => this.form.patchValue(values));

  //   // //get Actions from project
  //   // this.projet.asObservable()
  //   //   .pipe(
  //   //     tap(() => this.actions.next([])),
  //   //     filter((projet: Projet) => projet !== null),
  //   //     switchMap((projet: Projet): Observable<Action[]> => this.getActions(projet))
  //   //   )
  //   //   .subscribe(() => { return; });

  //   // //get Charge from project
  //   // this.projet.asObservable()
  //   //   .pipe(
  //   //     tap(() => this.charges.next([])),
  //   //     filter((projet: Projet) => projet !== null),
  //   //     switchMap((projet: Projet): Observable<Charge[]> => this.getCharges(projet))
  //   //   )
  //   //   .subscribe(() => { return; });
  // }

  // private setForm(projet): Observable<Projet> {
  //   return of(projet)
  //     .pipe(
  //       tap((projet: Projet) => {
  //         //mise en place des salarieForm
  //         if (projet.id === undefined) {
  //           this.addResponsable();
  //           this.addLocalisation();
  //         } else {
  //           projet.responsables.forEach((e, i)=>{
  //             this.addResponsable();
  //           });
  //           projet.localisations.forEach((e, i)=>{
  //             this.addLocalisation();
  //           });
  //         }
  //       }),
  //       map((projet: Projet) => {
  //         let _projet = Object.assign({}, projet);
  //         _projet.studyType = _projet.studyType ? _projet.studyType['@id'] : null;
  //         _projet.responsables = _projet.responsables.map(e => e['@id']);
  //         _projet.localisations = _projet.localisations.map(e => e['@id']);
  //         return _projet;
  //       }),
  //       tap((values) => {
  //         this.form.get('studyType').markAsTouched();
  //       })
  //     )
  }

  // private getActions(projet): Observable<Action[]> {
  //   this.loadingActions = true;
  //   return this.studiesR.actionsProject(projet.id)
  //     .pipe(
  //       map((res: any): Action[] => Object.values(res['hydra:member'])),
  //       tap(() => this.loadingActions = false),
  //       tap((actions: Action[]) => this.actions.next(actions)),
  //     )
  // }
  // reloadActions() {
  //   return this.getActions(this.projet.getValue());
  // }
  // refreshActions() {
  //   this.getActions(this.projet.getValue()).subscribe(() => { return; })
  // }

  // private getCharges(projet): Observable<Charge[]> {
  //   this.loadingCharges = true;
  //   return this.studiesR.chargesProject(projet.id)
  //           .pipe(
  //             map((res: any): Charge[] => Object.values(res['hydra:member'])),
  //             tap(() => this.loadingCharges = false),
  //             tap((charges: Charge[]) => this.charges.next(charges))
  //           )
  // }
  // refreshCharges() {
  //   this.getCharges(this.projet.getValue()).subscribe(() => { return; })
  // }

  // submit(): void { 	
  //   this.waiting = true;
  //   if (this.projet.getValue()) {
  //     //update
  //     this.studiesR
  //       .patch(
  //         (this.projet.getValue())['@id'],
  //         this.form.value
  //       )
  //       .pipe(
  //       	tap((): void => {
  //           this.displayForm = false;
	 //        	this.waiting = false;
	 //        	this.reset();
	 //        })
	 //      )
  //       .subscribe(
  //         (projet: Projet) => this.projet.next(projet),
  //         (err) => {
  //           this.waiting = false;
  //           //this._commonService.translateToaster("error", "ErrorMessage");
  //         }
  //       );
  //   } else {
  //     //create
  //     this.studiesR
  //       .createProjet(this.form.value)
  //       .pipe(
  //       	tap((): void => {
  //       		this.waiting = false;
  //           this.reset();
  //       	})
  //       )
  //       .subscribe(
  //         (projet: Projet) => this.projet.next(projet),
  //         (err) => {
  //           this.waiting = false;
  //           //this._commonService.translateToaster("error", "ErrorMessage");
  //         }
  //       );
  //   }
  // }

  // reset() {
  //   this.form.reset();
  //   this.clearFormArray(this.form.get("responsables") as FormArray);
  //   this.clearFormArray(this.form.get("localisations") as FormArray);
  //   this.setForm(this.projet.getValue())
  //     .subscribe((values) => this.form.patchValue(values));
  // }

  // get responsables(): FormArray {
  //   return this.form.get("responsables") as FormArray;
  // }

  // addResponsable(value = null): void {
  //   this.responsables.push(new FormControl(null, [Validators.required]));
  // }

  // removeResponsable(i: number): void {
  //   this.responsables.removeAt(i);;
  // }

  // get localisations(): FormArray {
  //   return this.form.get("localisations") as FormArray;
  // }

  // addLocalisation(value = null): void {
  //   this.localisations.push(new FormControl(value, [Validators.required]));
  // }

  // removeLocalisation(i: number): void {
  //   this.localisations.removeAt(i);;
  // }

  // private clearFormArray(formArray: FormArray) {
  //   while (formArray.length !== 0) {
  //     formArray.removeAt(0)
  //   }
  // }

  // snackBar(msg:string, closeMsg:string='Fermer', duration:number=4000, position:'top' | 'bottom'='top'): void {
  //   this._snackBar.open(msg, closeMsg, {
  //     duration: duration,
  //     verticalPosition: position
  //   });
  // }
}
