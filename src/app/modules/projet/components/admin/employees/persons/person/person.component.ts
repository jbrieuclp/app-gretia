import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap, map } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared/';
import { PersonService } from '../person.service';
import { EmployeeService } from './employee.service';
import { EmployeeRepository } from '@projet/repository/employee.repository';
import { PersonRepository } from '@projet/repository/person.repository';
import { Person } from '@projet/repository/project.interface';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-admin-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  private _subscriptions: Subscription[] = [];
	public person: Person = null;
	public loading: boolean = false;

  constructor(
    private personS: PersonService,
    private employeeR: EmployeeRepository,
    private personR: PersonRepository,
    private employeeS: EmployeeService,
    private globalsS: GlobalsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une person dans l'URL
    * La vérification que le parametre person est bien un nombre est effectué
    **/
    this.route.params
      .pipe(
        map(param => {
          if ( isNaN(Number(param.person)) ) {
            throw new Error("Not Found");
          }
          return param.person;
        }),
        switchMap(id => this.getPerson(id))
      )
      .subscribe(
        person => this.person = person,
        err => this.router.navigate(['../'], { relativeTo: this.route })
      );

  }

  getPerson(person_id): Observable<Person> {
  	this.loading = true;
  	return this.personR.get(person_id)
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
          .subscribe(() => {return;});
      }
    });
  }

}
