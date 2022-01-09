import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Action, WorkCategory } from '../../../../repository/project.interface';
import { ActionCategoriesService } from './action-categories.service';

@Component({
  selector: 'app-projet-admin-actions-categories',
  templateUrl: './action-categories.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class ActionCategoriesComponent implements OnInit {

	get categories(): WorkCategory[] {
    return this.actionCategoriesS.actionCategories;
  }
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  get category(): WorkCategory {
    return this.actionCategoriesS.itemSelected.getValue();
  }

  constructor(
  	private actionCategoriesS: ActionCategoriesService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.actionCategoriesS.stepper = this.stepper;
  }

  select(category: WorkCategory) {
    this.actionCategoriesS.moveStepper(0);
    this.actionCategoriesS.itemSelected.next(category);
  }

  addAction() {
    this.actionCategoriesS.itemSelected.next(null);
    this.actionCategoriesS.moveStepper(1);
  }
}
