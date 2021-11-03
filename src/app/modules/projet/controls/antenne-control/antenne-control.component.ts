import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { EmployeeRepository } from '../../repository/employee.repository';
import { Antenne } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-antenne',
  templateUrl: './antenne-control.component.html',
  styleUrls: ['./antenne-control.component.scss']
})
export class AntenneControlComponent implements OnInit {

  @Input() form: FormControl = new FormControl();
  @Input() required: boolean = false;
  @Input() appearance: string = 'legacy';
  options: Antenne[] = [];
  loading: boolean = false;

  constructor(
    private salarieR: EmployeeRepository
  ) { }

  ngOnInit() {
    this.getAntennes();
  }

  getAntennes() {
    this.loading = true;
    this.salarieR.antennes()
      .pipe(
        tap(()=>this.loading = false),
        map((data: any): Antenne[]=>data["hydra:member"]),
        map((antennes: Antenne[])=>antennes.sort((a, b)=> a.name > b.name && 1 || -1))
      )
      .subscribe((antennes: Antenne[])=>this.options = antennes);
  }

}
