import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SelectControl } from '../select-control/select.control';
import { StudiesRepository } from '../../repository/studies.repository';
import { DeadlineType } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-deadline-type',
  templateUrl: '../select-control/select.control.html'
})
export class DeadlineTypeControlComponent extends SelectControl implements OnInit {

  label = "Type d'échéance";
  loading: boolean = false;
  optionDisplayFn = (option) => option.label;
  value = (option) => option['@id'];

  constructor(
    private studiesR: StudiesRepository
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getChargeTypes();
  }

  getChargeTypes() {
    this.loading = true;
    this.studiesR.deadline_types()
      .pipe(
        map((data: any): DeadlineType[]=>data["hydra:member"]),
        tap(() => this.loading = false)
      )
      .subscribe((chargeTypes:DeadlineType[]) => this.options = chargeTypes);
  }
}