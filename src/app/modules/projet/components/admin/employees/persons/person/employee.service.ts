import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { BehaviorSubject, Subject, of, Observable } from 'rxjs';
import { filter, tap, map } from 'rxjs/operators';

import { EmployeeRepository } from '../../../../../repository/employee.repository'
import { Employee, Person } from '../../../../../repository/project.interface'
import { EmployeeFormService } from './employee-form.service';
import { PersonService } from '../person.service';

@Injectable()
export class EmployeeService {

	public person: Person;
  public employee: BehaviorSubject<Employee> = new BehaviorSubject(null);
	public form: FormGroup;
	public waiting: boolean = false;

  //gestion affichages sur pages persons display list/form
  public stepper: MatStepper;

  constructor(
  	private fb: FormBuilder,
    private employeeR: EmployeeRepository,
    private employeeFormS: EmployeeFormService,
    private personS: PersonService,
  ) { 
    this.person = this.personS.person.getValue();
    this.initForm();
    this.setObservables();
  }

  private get initialValues(): Employee {
    return {rate: 100};
  }

  initForm(): void {
    this.form = this.employeeFormS.createForm(this.initialValues);
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    //patch le form par les valeurs par defaut si creation
    this.employee.asObservable()
      .pipe(
        tap(() => this.reset()),
        filter((employee: Employee)=>employee !== null),
        map((employee: Employee): any => {
          employee.function = employee.function ? employee.function['@id'] : null; 
          employee.antenne = employee.antenne ? employee.antenne['@id'] : null; 
          return employee;
        })
      )
      .subscribe((values) => {
        this.form.patchValue(values);
      });
  }

  submit(): Observable<Employee> {   
    this.waiting = true;
    let api;
    if (this.employee.getValue()) {
      //update
      api = this.employeeR.patch((this.employee.getValue())['@id'], this.form.value);
    } else {
      //create
      const value = Object.assign({person: this.person['@id']}, this.form.value);
      api = this.employeeR.createEmployee(value)
              .pipe(
                tap((employee: Employee) => console.log(employee)),
              );
    }

    return api
      .pipe(
        tap((): void => {
          this.waiting = false;
          this.reset();
        })
      );   
  }

  moveStepper(index: number) {
    this.stepper.selectedIndex = index;
  }

  reset() {
    this.form.reset(this.initialValues);
  }
}