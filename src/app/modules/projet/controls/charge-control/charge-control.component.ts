import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SelectControl } from '../select-control/select.control';
import { ActionsRepository } from '../../repository/actions.repository';
import { Charge } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-charge',
  templateUrl: '../select-control/select.control.html'
})
export class ChargeControlComponent extends SelectControl implements OnInit {

  categories: Charge[] = [];
  label = "Montage";
  optionDisplayFn = (option) => option.label;
  value = (option) => option['@id'];

  constructor(
  	private actionR: ActionsRepository
  ) {
    super();
  }

  ngOnInit() {

  }
}
