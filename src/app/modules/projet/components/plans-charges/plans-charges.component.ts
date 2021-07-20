import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { tap, map, filter, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { AuthService } from '../../../../shared/auth/authentication.service';
import { PersonRepository } from '../../repository/person.repository';
import { Personne } from '../../repository/salarie.repository';
import { PlanChargesService } from './plan-charges/plan-charges.service';

@Component({
  selector: 'app-projet-plans-charges',
  templateUrl: './plans-charges.component.html',
  styleUrls: ['./plans-charges.component.scss']
})
export class PlansChargesComponent implements OnInit {

  years: number[] = [];
  yearsControl = new FormControl('', [Validators.required]);
  persons: BehaviorSubject<Personne[]> = new BehaviorSubject([]);
  personControl = new FormControl('', [Validators.required]);
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private personR: PersonRepository,
    private authService: AuthService, 
    private planChargesS: PlanChargesService, 
  ) { }

  ngOnInit() {
    this.getYears();
    this.getPersons();

    combineLatest(
      this.route.params.pipe(distinctUntilChanged()),
      this.persons.asObservable(),
      this.authService.getUser().asObservable()
        .pipe(
          filter(user=>user.id !== null)
        )
    )
      .pipe(
        map(([params, persons, user])=>{
          let person;
          if (params.person) {
            person = persons.find(p=>p.id === Number(params.person));
          } else {
            person = persons.find(p=>p.compteId === user.id);
          }

          return [person, params.year ? Number(params.year) : Number(moment().year())]
        }),
        filter(([person, year])=>person !== undefined),
        distinctUntilChanged(),
        tap(([person, year])=>{
          this.planChargesS.year.next(year);
          this.planChargesS.person.next(person);
        }),
      )
      .subscribe(([person, year])=>{
        this.yearsControl.setValue(year);
        this.personControl.setValue(person['@id']);
      });

    combineLatest(
      this.personControl.valueChanges
        .pipe(
          map((id: string)=>this.persons.getValue().find(p=>p['@id'] === id)),
          filter((person: Personne)=>person !== undefined),
        ),
      this.yearsControl.valueChanges
    )
      .subscribe(([person, year])=>this.router.navigate(['/projet/plan-de-charges/', person.id, year]));
  }

  getYears() {
    for (let i = 1970; i <= moment().year() + 3; i++) {
      this.years.push(i);
    }
    this.years.reverse();
  }

  getPersons() {
    this.loading = true;
    this.personR.personnes()
      .pipe(
        tap(()=>this.loading = false),
        map((data: any): Personne[]=>data["hydra:member"])
      )
      .subscribe((persons: Personne[])=>this.persons.next(persons));
  }



}
