import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, map, catchError, switchMap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../shared';
import { EmployeeRepository } from '../../../../repository/employee.repository';
import { Function } from '../../../../repository/project.interface';

@Injectable()
export class FunctionService {

	public eFunctions: Function[] = [];
  public totalItems: number = 0;
	public eFunction: BehaviorSubject<Function> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;
  public loadingList: boolean = false;
	//gestion affichages sur pages eFunctions display list/form
	public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
  	private employeeR: EmployeeRepository,
    private location: Location,
    private router: Router,
    private globalsS: GlobalsService,
  ) { 
  	this.initForm();
  	this.setObservables();

  	this.getFunctions().subscribe(() => {return;});
  }

  getFunctions(): Observable<Function[]> {
    this.loadingList = true;
    return this.employeeR.functions()
      .pipe(
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Function[] => data["hydra:member"]),
        catchError(err => of([])),
        tap((eFunctions: Function[]) => this.eFunctions = eFunctions),
        tap(() => this.loadingList = false),
      );
  }

  private get initialValues(): Function {
    return {};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      label: [null, Validators.required]
    });

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    this.eFunction.asObservable()
      .pipe(
        tap(() => this.form.reset(this.initialValues)),
        filter((eFunction)=>eFunction !== null),
        tap((eFunction) => {
          //gestion de l'URL pour intégrer l'id de la eFunction dedans
          let routeElements = (this.router.url.split('?')[0]).split('/');
          let params = this.router.url.split('?')[1] !== undefined ? '?' + this.router.url.split('?')[1] : '';
          const lastElement = routeElements.pop();
          if (isNaN(parseInt(lastElement))) {
            routeElements.push(lastElement);
          }
          routeElements.push((eFunction.id).toString());
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
    if (this.eFunction.getValue()) {
      //update
      api = this.employeeR.patch((this.eFunction.getValue())['@id'], this.form.value);
    } else {
      //create
      api = this.employeeR.createFunction(this.form.value);
    }

    api
      .pipe(
        tap((): void => {
          this.waiting = false;
          this.reset();
        }),
        tap((eFunction: Function) => this.eFunction.next(eFunction)),
        switchMap(() => this.getFunctions())
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

  delete(item: Function): void {
    const idx = this.eFunctions.findIndex((eFunction)=>eFunction.id == item.id);
    if (idx > -1) {
      this.employeeR.delete(item['@id'])
        .pipe(
          tap(() => this.eFunction.next(null)),
          switchMap(() => this.getFunctions())
        )
        .subscribe(
          () => this.globalsS.snackBar({msg: "Function supprimée", color: 'green', duration: 4000}),
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
