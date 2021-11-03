import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { ActionCategoriesService } from '../action-categories.service';

@Component({
  selector: 'app-projet-action-category-form',
  templateUrl: './action-category-form.component.html'
})
export class ActionCategoryFormComponent implements OnInit {
	
	public form: FormGroup;

	get category() {
		return this.actionCategoriesS.itemSelected.getValue();
	}

  constructor(
  	private actionCategoriesS: ActionCategoriesService
  ) { }

  ngOnInit() {
  	this.form = this.actionCategoriesS.form;
  }

  save() {
  	this.actionCategoriesS.submit();
  }

  cancel() {
    this.actionCategoriesS.reset();
    this.actionCategoriesS.moveStepper(0);
  }
}
