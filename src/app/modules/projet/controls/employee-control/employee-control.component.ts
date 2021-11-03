import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { map, tap, switchMap, startWith, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { EmployeeRepository } from '../../repository/employee.repository';
import { Person } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-employee',
  templateUrl: './employee-control.component.html',
  styleUrls: ['./employee-control.component.scss']
})
export class EmployeeControlComponent implements OnInit, OnDestroy {

	@Input() form: FormControl;
  persons: Person[] = [];
  historique: boolean = false;
  loading: boolean = false;
  _subscription: Subscription;

  constructor(
  	private employeeR: EmployeeRepository
  ) { }

  ngOnInit() {
    this.loading = true;
    if (this.form.value !== null && this.form.value['@id'] !== undefined) {
      if ( this.form.value.person.workIn === null ) {
        this.historique = true;
      }
      this.form.setValue(this.form.value['@id']);
    }


  	this._subscription = this.form.valueChanges
      .pipe(
        startWith(this.form.value),
        distinctUntilChanged(),
        switchMap((val): Observable<Person[]> => this.getPersons())
      )
  		.subscribe((persons: Person[]) => this.persons = persons);
  }

  getPersons(): Observable<Person[]> {
    this.loading = true;
    return this.employeeR.persons()
      .pipe(
        map((data: any): Person[]=>data["hydra:member"]),
        tap(() => this.loading = false),
        map((persons: Person[]): Person[] => persons.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))),
        //tap((persons: Person[]) => this.setHistoricUser(persons)),
      )
  }

  private setHistoricUser(persons): void {
    const id = this.form.value;
    this.historique = persons.filter(e => e.workIn).findIndex(e => e.workIn['@id'] === id) === -1;
  }

  displayLabel(person, employee = null): string {
    if (this.historique) {
      if (employee.contractEnd === null) {
        return `${ person.firstName } (poste actuel - débuté le ${ moment(employee.contractStart).format('MM/DD/YYYY') })`;
      } else {
        return `${ person.firstName } (ancien poste - du ${ moment(employee.contractStart).format('MM/DD/YYYY') } au ${ moment(employee.contractEnd).format('MM/DD/YYYY') })`;
      }
    } else {
      return `${ person.firstName } ${ person.name }`;
    }
  }

  ngOnDestroy() {
    this._subscription.unsubscribe();
  }

}
