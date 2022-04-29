import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractControl } from '../abstract.control';
import { EmployeeRepository } from '../../repository/employee.repository';
import { Local } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-local',
  templateUrl: '../autocomplete-control/autocomplete.template.html'
})
export class LocalControlComponent extends AbstractControl implements OnInit, OnDestroy {

  @Input() id: '@id'|'compteId' = '@id';
  @Input() label = "Antenne";
  optionDisplayFn = (option) => `${option.name}`;
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

    this.getLocals()
      .subscribe((locals: Local[]) => this.options = locals);
  }

  getLocals() {
    this.loading = true;
    return this.employeeR.locals()
      .pipe(
        tap(() => this.loading = false),
        map((data: any): Local[] => data["hydra:member"]),
        map((locals: Local[]) => locals.sort((a, b) => a.name > b.name && 1 || -1))
      );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
