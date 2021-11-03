import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared';
import { PersonService } from '../person.service';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from '../../../../../repository/employee.repository';
import { Person } from '../../../../../repository/project.interface';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-admin-person',
  templateUrl: './person.component.html',
  styles: ['table .mat-icon-button { height: 24px; line-height: 24px; }']
})
export class PersonneComponent implements OnInit, AfterViewChecked {

  private _subscriptions: Subscription[] = [];
	public person: Person = null;
	public loading: boolean = false;
  public displayForm: boolean = false;

  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  constructor(
    private personS: PersonService,
    private employeeR: EmployeeRepository,
    private employeeS: EmployeeService,
    private globalsS: GlobalsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.personS.person.asObservable()
        .pipe(
          distinctUntilChanged(),
          tap(() => {
            this.person = null;
            this.displayForm = false;
          }),
          filter((person: Person) => person !== null),
          switchMap((person: Person) => this.getPerson(person))
        )
        .subscribe((person: Person) => this.person = person)
    );

  }

  ngAfterViewChecked() {
    if (this.stepper !== undefined) {
      this.employeeS.stepper = this.stepper;
    }
  }

  getPerson(person): Observable<Person> {
  	this.loading = true;
  	return this.employeeR.get(person['@id'])
  		.pipe(
  			tap(() => this.loading = false)
  		);
  }

  delete(person: Person) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de ${person.firstname} ${person.name} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.personS.delete(person);
      }
    }); 
  }

  refreshPerson() {
    this.getPerson(this.person)
      .subscribe((person: Person) => this.person = person);
  }

  addEmployee() {
    this.employeeS.employee.next(null);
    this.employeeS.moveStepper(1);
  }

  editContrat(employee) {
    this.employeeS.employee.next(employee);
    this.employeeS.moveStepper(1);
  }

  deleteContrat(employee) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.employeeR.delete(employee['@id'])
          .pipe(
            tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"}))
          )
          .subscribe(() => this.refreshPerson());
      }
    });
  }

}
