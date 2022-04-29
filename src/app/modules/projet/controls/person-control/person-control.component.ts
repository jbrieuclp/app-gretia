import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractControl } from '../abstract.control';
import { EmployeeRepository } from '../../repository/employee.repository';
import { Person } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-person',
  templateUrl: '../autocomplete-control/autocomplete.template.html'
})
export class PersonControlComponent extends AbstractControl implements OnInit, OnDestroy {

  @Input() id: '@id'|'compteId' = '@id';
  @Input() label = "Personnes";
  optionDisplayFn = (option) => `${option.firstname} ${option.name}`;
  value = (option) => option[this.id] || option['@id'];
  options: any[] = [];
  //possibilité de vider la valeur par un bouton
  private _clearable: boolean = true;
  @Input() set clearable(val: any) { this._clearable = ((val.toString()).toLowerCase() === 'false' ? false : true); };
  get clearable() { return this._clearable };

  constructor(
  	private employeeR: EmployeeRepository,
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.getPersons()
      .subscribe((persons: Person[]) => this.options = persons);
  }

  getPersons() {
    this.loading = true;
    return this.employeeR.persons()
      .pipe(
        tap(()=>this.loading = false),
        map((data: any): Person[]=>data["hydra:member"]),
        map((persons: Person[])=>persons.sort((a, b) => a.firstname > b.firstname && 1 || -1))
      );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
