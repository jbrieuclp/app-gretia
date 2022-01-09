import { Component, OnInit, OnDestroy, Input, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractControl } from '../abstract.control';
import { WorksRepository } from '../../repository/works.repository';
import { WorkCategory } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-work-category',
  templateUrl: '../autocomplete-control/autocomplete.template.html'
})
export class WorkCategoryControlComponent extends AbstractControl implements OnInit, OnDestroy {

  label = "Catégorie";
  optionDisplayFn = (option) => option.label;
  value = (option) => option['@id'];
  options: any[] = [];

  constructor(
  	private worksR: WorksRepository
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.getCategories()
      .subscribe((categories: WorkCategory[])=>this.options = categories);
  }

  getCategories(): Observable<WorkCategory[]> {
    this.loading = true;

    return this.worksR.workCategories()
      .pipe(
        tap(() => this.loading = false),
        map((data: any): WorkCategory[]=>data["hydra:member"]),
        map((categories: WorkCategory[])=>categories.sort((a, b)=> a.orderBy - b.orderBy))
      )
      ;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
