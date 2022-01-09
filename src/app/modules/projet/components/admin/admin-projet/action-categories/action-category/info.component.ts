import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from "@angular/forms";
import { tap } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

import { WorkCategory } from '../../../../../repository/project.interface';
import { ActionCategoriesService } from '../action-categories.service';

@Component({
  selector: 'app-projet-admin-action-category-info',
  templateUrl: './info.component.html',
  styleUrls: ['../../../../css/info.scss']
})
export class ActionCategoryInfoComponent implements OnInit {

  public category: WorkCategory;

  constructor(
  	public dialog: MatDialog,
  	private actionCategoriesS: ActionCategoriesService,
  	private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  	this.actionCategoriesS.itemSelected.asObservable()
  		.subscribe(category=>this.category = category);
  }

  edit(category: WorkCategory) {
    this.actionCategoriesS.itemSelected.next(category);
    this.actionCategoriesS.moveStepper(1);
  }

  delete(category: WorkCategory) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la valeur "${category.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.actionCategoriesS.delete(category);
      }
    }); 
  }
}
