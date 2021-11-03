import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { SelectControl } from '../select-control/select.control';
import { ActionsRepository } from '../../repository/actions.repository';
import { ActionCategory } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-action-category',
  templateUrl: '../select-control/select.control.html'
})
export class ActionCategoryControlComponent extends SelectControl implements OnInit {

  categories: ActionCategory[] = [];
  label = "Catégorie";
  optionDisplayFn = (option) => option.label;
  value = (option) => option['@id'];

  constructor(
  	private actionR: ActionsRepository
  ) {
    super();
  }

  ngOnInit() {
    this.getCategories()
      .subscribe((categories: ActionCategory[])=>this.options = categories);
  }

  getCategories(): Observable<ActionCategory[]> {
    this.loading = true;

    return this.actionR.actionCategories()
      .pipe(
        tap(() => this.loading = false),
        map((data: any): ActionCategory[]=>data["hydra:member"]),
        map((categories: ActionCategory[])=>categories.sort((a, b)=> a.orderBy - b.orderBy))
      )
      ;
  }
}
