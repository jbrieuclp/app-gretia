import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, combineLatest } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Person } from '../../../../repository/project.interface';
import { PersonService } from './person.service';

@Component({
  selector: 'app-projet-admin-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class PersonsComponent implements OnInit, OnDestroy {

	get persons(): Person[] {
    return this.personS.persons;
  }
  private id: string;

  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  constructor(
  	public personS: PersonService,
    public dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    combineLatest(
      this.route.params.pipe(
        map(p => p.person),
        filter(id => id !== undefined),
        tap(id => this.id = id.toString()),
      ),
      this.personS._persons.asObservable()
    )
      .pipe(
        map(([id, persons]): Person => persons.find(person => person.id == id)),
        filter((person: Person) => person !== undefined)
      )
      .subscribe((person: Person) => this.personS.person.next(person));

    this.personS.stepper = this.stepper;
  }

  selected(person: Person) {
    let url = this.id ? this.router.url.replace(this.id, person.id.toString()) : `${this.router.url}/${person.id.toString()}`;
    this.router.navigateByUrl(url);
  }

  create() {
    this.personS.person.next(null);
    this.personS.moveStepper(1);
  }

  edit() {
    this.personS.moveStepper(1);
  }

  ngOnDestroy() {
    this.personS.person.next(null);
  }
}
