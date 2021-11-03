import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, map, switchMap, catchError } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../shared';
import { EmployeeRepository } from '../../../../repository/employee.repository';
import { Person } from '../../../../repository/project.interface';
import { EmployeeFormService } from './person/employee-form.service';

@Injectable()
export class PersonService {

	public totalItems: number = 0;
  public _persons: BehaviorSubject<Person[]> = new BehaviorSubject([]);
  get persons(): Person[] { return this._persons.getValue(); }
	public person: BehaviorSubject<Person> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;
  public loadingList: boolean = false;
	//gestion affichages sur pages persons display list/form
	public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
  	private employeeR: EmployeeRepository,
    private employeeFormS: EmployeeFormService,
    private globalsS: GlobalsService,
  ) { 
  	this.initForm();
  	this.setObservables();

  	this.getPersons().subscribe(() => {return;});
  }

  getPersons(): Observable<Person[]> {
    this.loadingList = true;
    return this.employeeR.persons()
      .pipe(
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Person[] => data["hydra:member"]),
        catchError(err => of([])),
        tap((persons: Person[]) => this._persons.next(persons)),
        tap(() => this.loadingList = false),
      );
  }

  private get initialValues(): Person {
    return {};
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      name: [null, Validators.required],
      firstName: [null, Validators.required],
      alias: [null, Validators.required]
    });

    this.addSalarieForm();

    this.form.patchValue(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    //patch le form par les valeurs par defaut si creation
    this.person.asObservable()
      .pipe(
        tap(() => this.reset()),
        filter((person)=>person !== null),
        tap((person) => {
          //Pour une modification (c'est forcément le cas ici) on supprime les form salariés
          this.clearFormArray("employees");
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });
  }

  submit(): void {   
    this.waiting = true;
    let api;
    if (this.person.getValue()) {
      //update
      api = this.employeeR.patch((this.person.getValue())['@id'], this.form.value);
    } else {
      //create
      api = this.employeeR.createPerson(this.form.value);
    }

    api
      .pipe(
        tap((): void => {
          this.waiting = false;
          this.reset();
          this.moveStepper(0);
        }),
        tap((person: Person) => this.person.next(person)),
        switchMap(() => this.getPersons())
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

  delete(item: Person): void {
  	const idx = this.persons.findIndex((person)=>person.id == item.id);
    if (idx > -1) {
    	this.employeeR.delete(item['@id'])
        .pipe(
          tap(()=>this.person.next(null))
        )
    		.subscribe(data => this.persons.splice(idx, 1));
    }
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
	}

  reset() {
    this.form.reset(this.initialValues);
    this.clearFormArray("employees");
    this.addSalarieForm();
  }

  addSalarieForm(): void {
    this.form.addControl('employees', this.fb.array([]));
    (this.form.get('employees') as FormArray).push(
      this.employeeFormS.createForm({taux: 100})
    );
  }

  private clearFormArray(item: string) {
    if (this.form.get(item)) {
      this.form.removeControl(item);
    }
  }
}
