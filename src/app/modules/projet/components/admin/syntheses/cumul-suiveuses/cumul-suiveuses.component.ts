import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { tap, map } from "rxjs/operators";
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
  displayCategories: any[] = [
    {id: 'expectedTime', label:'Temp attendu', displayFn: (val) => Math.round(val / 60 * 100) / 100}, 
    {id: 'duration', label: 'Heure journalière', displayFn: (val) => Math.round(val / 60 * 100) / 100}, 
    {id: 'nightDuration', label: 'Heure de nuit', displayFn: (val) => Math.round(val / 60 * 100) / 100}, 
    {id: 'travelDuration', label: 'Heure de déplacement', displayFn: (val) => Math.round(val / 60 * 100) / 100}, 
    {id: 'holidayQuantity', label:'Congé', displayFn: (val) => val}, 
    {id: 'total', label:'Total', displayFn: (val) => Math.round(val / 60 * 100) / 100}, 
    {id: 'recup', label:'Recup', displayFn: (val) => Math.round(val / 60 * 100) / 100}
  ];
  waiting: boolean = false;
  downloading: boolean = false;

  tableContainerH: number;

  constructor(
    private fb: FormBuilder,
    private suiveuseR: SuiveuseRepository
  ) { 
    moment.locale('fr');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.tableContainerH = window.innerHeight-310;
  }

  ngOnInit() {
    this.form = this.fb.group({
      start: [moment().startOf('month').format('YYYY-MM-DD'), Validators.required],
      end: [moment().endOf('month').format('YYYY-MM-DD'), Validators.required]
    });
  }

  getWorks() {
    this.onResize(null);
    this.waiting = true;
    this.suiveuseR.cumulative({
      "date[after]": moment(this.form.get('start').value).format('YYYY-MM-DD'), 
      "date[before]": moment(this.form.get('end').value).format('YYYY-MM-DD')
    })
      .pipe(
        tap(() => this.waiting = false),
        map((data: any): Function[] => data["hydra:member"]),
        tap((data) => this.dates = this.getDates(data)),
        tap((data) => this.weeks = this.getWeeks(data)),
        tap((data) => this.persons = this.getPersons(data))
      )
      .subscribe(
        res => this.data = res,
        (err) => this.waiting = false
      );
  }

  downloadCsv() {
    this.downloading = true;
    this.suiveuseR.getCumulativeExport({
      "date[after]": moment(this.form.get('start').value).format('YYYY-MM-DD'), 
      "date[before]": moment(this.form.get('end').value).format('YYYY-MM-DD')
    })
      .pipe(
        map((res: any): [any, string] => {
          const filename = `suiveuses_${moment(this.form.get('start').value).format('YYYYMMDD')}_${moment(this.form.get('end').value).format('YYYYMMDD')}.csv`;
          return [res, filename];
        }),
        tap(() => this.downloading = false)
      )
      .subscribe(
        ([res, filename]: [any, string]) => this.saveFile(res, filename),
        (err) => this.downloading = false
      );
  }

  /**
   * Method is use to download file.
   * @param data - Array Buffer data
   * @param type - type of the document.
   */
  downLoadFile(data: any, type: string) {
    console.log(data);
    let blob = new Blob([data], {type: type});
    console.log(blob);
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
  }

  saveFile(blob, filename) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0)
  }

  selectPersonalRecup(date, key: string, person: any) {
    let item = person[key].find(e => e.date === date);
    return item ? item.quantity / 60 : null;
  }

  getTimeValue(person, date, category): number {
    return this.data
      .filter(elem => elem.date === date && elem.idPerson === person.idPerson)
      .map(elem => category.displayFn(+elem[category.id]))
      .map(time => time === 0 ? null : time);
  }

  getWeekCumulTime(person, week, category) {
    let time = this.data
      .filter(elem => `${moment(elem.date).year()}-${elem.weekNumber}` === week && elem.idPerson === person.idPerson)
      .map(elem => category.displayFn(+elem[category.id]))
      .reduce((a, b) => a + b, 0);

    return time === 0 ? null : time;
  }

  isWorked(date): boolean {
    let day = this.data.find(elem => elem.date === date);
    return day !== null ? day.isWe || day.isNotWorked : false;
  }

  private getDates(data): any[] { 
    return data
            .map(i => i.date) //retourne la date
            .filter((elem, index, self) => index === self.indexOf(elem)) //dédoublonne
            .sort(); 
  };

  private getWeeks(data): any[] { 
    return data
            .map(i => `${moment(i.date).year()}-${i.weekNumber}`) //retourne la semaine
            .filter((elem, index, self) => index === self.indexOf(elem)) //dédoublonne
            .sort(); 
  };

  private getPersons(data): number[] { 
    return data
            .map(i => {return {'idPerson': i.idPerson, 'name': i.name, 'firstname': i.firstname}; }) //retourne le champ idPerson
            .filter((elem, index, self) => elem.idPerson !== null && index === self.findIndex((t) => t.idPerson === elem.idPerson)) //dédoublonne
            .sort();
  };
}
