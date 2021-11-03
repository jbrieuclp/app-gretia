import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { Observable, BehaviorSubject, Subject, of } from 'rxjs';
import { filter, tap, map, catchError, switchMap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../shared';
import { EmployeeRepository } from '../../../../repository/employee.repository';
import { Antenne } from '../../../../repository/project.interface';

@Injectable()
export class AntenneService {

	public antennes: Antenne[] = [];
  public totalItems: number = 0;
	public antenne: BehaviorSubject<Antenne> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;
  public loadingList: boolean = false;
	//gestion affichages sur pages antennes display list/form
	public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
  	private salarieR: EmployeeRepository,
    private location: Location,
    private router: Router,
    private globalsS: GlobalsService,
  ) { 
  	this.initForm();
  	this.setObservables();

  	this.getAntennes().subscribe(() => {return;});
  }

  getAntennes(): Observable<Antenne[]> {
    this.loadingList = true;
    return this.salarieR.antennes()
      .pipe(
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Antenne[] => data["hydra:member"]),
        catchError(err => of([])),
        tap((antennes: Antenne[]) => this.antennes = antennes),
        tap(() => this.loadingList = false),
      );
  }

  private get initialValues(): Antenne {
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
    this.antenne.asObservable()
      .pipe(
        tap(() => this.form.reset(this.initialValues)),
      	filter((antenne)=>antenne !== null),
        tap((antenne) => {
          //gestion de l'URL pour intégrer l'id de l'antenne dedans
          let routeElements = (this.router.url.split('?')[0]).split('/');
          let params = this.router.url.split('?')[1] !== undefined ? '?' + this.router.url.split('?')[1] : '';
          const lastElement = routeElements.pop();
          if (isNaN(parseInt(lastElement))) {
            routeElements.push(lastElement);
          }
          routeElements.push((antenne.id).toString());
          this.location.go(`${routeElements.join('/')}${params}`);
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });
  }

  submit(): void { 	
    this.waiting = true;
    let api;
    if (this.antenne.getValue()) {
      //update
      api = this.salarieR.patch((this.antenne.getValue())['@id'], this.form.value );
    } else {
      //create
      api = this.salarieR.createAntenne(this.form.value);
    }

    api
      .pipe(
        tap((): void => {
          this.waiting = false;
          this.reset();
        }),
        tap((antenne: Antenne) => this.antenne.next(antenne)),
        switchMap(() => this.getAntennes())
      )
      .subscribe(
        () => this.globalsS.snackBar({msg: "Enregistrement effectué"}),
        (err) => {
          err.error.violations.forEach(e => {
            this.globalsS.snackBar({msg: e.message, color: 'red', duration: null});
            this.form.get(e.propertyPath).setErrors({'inUse': true});
          })
        }
      );
  }

  delete(item: Antenne): void {
  	const idx = this.antennes.findIndex((antenne)=>antenne.id == item.id);
    if (idx > -1) {
    	this.salarieR.delete(item['@id'])
        .pipe(
          tap(() => this.antenne.next(null)),
          switchMap(() => this.getAntennes())
        )
    		.subscribe(
          () => this.globalsS.snackBar({msg: "Antenne supprimée", color: 'green', duration: null}),
          (err) => this.globalsS.snackBar({msg: "Erreur inconnue", color: 'red', duration: 4000})
        );
    }
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
	}

  reset() {
    this.form.reset(this.initialValues);
    this.moveStepper(0);
  }
}
