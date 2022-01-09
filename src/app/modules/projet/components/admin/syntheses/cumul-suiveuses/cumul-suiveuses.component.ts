import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { Work } from '../../../../repository/project.interface';
import { SuiveuseRepository } from '../../../../repository/suiveuse.repository';

@Component({
  selector: 'app-project-admin-cumul-suiveuses',
  templateUrl: './cumul-suiveuses.component.html',
  styleUrls: ['./cumul-suiveuses.component.scss']
})
export class CumulSuiveusesComponent implements OnInit {

  form: FormGroup;
  data: any;
  dates: string[] = [];
  weeks: string[] = [];
  persons: any[] = [];
  displayCategories: string[] = ['expected_time', 'duration', 'night_duration', 'travel_duration', 'total', 'recup'];
  waiting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private suiveuseR: SuiveuseRepository
  ) { 
    moment.locale('fr');
  }

  ngOnInit() {
    this.form = this.fb.group({
      start: [moment().startOf('month').format('YYYY-MM-DD'), Validators.required],
      end: [moment().endOf('month').format('YYYY-MM-DD'), Validators.required]
    });
  }

  getWorks() {
    this.waiting = true;
    this.suiveuseR.cumulative({
      "startAt": moment(this.form.get('start').value).format('YYYY-MM-DD'), 
      "endAt": moment(this.form.get('end').value).format('YYYY-MM-DD')
    })
      .pipe(
        tap(() => this.waiting = false),
        tap((data) => this.dates = this.getDates(data)),
        tap((data) => this.weeks = this.getWeeks(data)),
        tap((data) => this.persons = this.getPersons(data))
      )
      .subscribe(res => this.data = res);
  }

  selectPersonalRecup(date, key: string, person: any) {
    let item = person[key].find(e => e.date === date);
    return item ? item.quantity / 60 : null;
  }

  getTimeValue(person, date, category): number {
    return this.data
      .filter(elem => elem.date === date && elem.id_person === person.id_person)
      .map(elem => (+elem[category]) / 60)
      .map(time => time === 0 ? null : time);
  }

  getWeekCumulTime(person, week, category) {
    let time = this.data
      .filter(elem => `${moment(elem.date).year()}-${elem.week_number}` === week && elem.id_person === person.id_person)
      .map(elem => +elem[category])
      .reduce((a, b) => a + b, 0);

    return time === 0 ? null : time / 60;
  }

  isWorked(date): boolean {
    let day = this.data.find(elem => elem.date === date);
    return day !== null ? day.is_we || day.is_not_worked : false;
  }

  private getDates(data): any[] { 
    return data
            .map(i => i.date) //retourne la date
            .filter((elem, index, self) => index === self.indexOf(elem)) //dédoublonne
            .sort(); 
  };

  private getWeeks(data): any[] { 
    return data
            .map(i => `${moment(i.date).year()}-${i.week_number}`) //retourne la semaine
            .filter((elem, index, self) => index === self.indexOf(elem)) //dédoublonne
            .sort(); 
  };

  private getPersons(data): number[] { 
    return data
            .map(i => {return {'id_person': i.id_person, 'name': i.name, 'first_name': i.first_name}; }) //retourne le champ id_person
            .filter((elem, index, self) => elem.id_person !== null && index === self.findIndex((t) => t.id_person === elem.id_person)) //dédoublonne
            .sort();
  };
}
