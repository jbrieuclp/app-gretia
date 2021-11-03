import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject } from "rxjs";
import { tap, map } from "rxjs/operators";

import { GlobalsService } from '../../../../../../../shared';
import { ProjectsRepository } from '../../../../../repository/projects.repository'
import { Deadline, DeadlineType } from '../../../../../repository/project.interface'
import { DeadlineService } from './deadline.service';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-deadline',
  templateUrl: './deadline.component.html',
  providers: [DeadlineService]
})
export class DeadlineComponent implements OnInit {

	@Input() deadline: Deadline;
	@Output() deadlineChange = new EventEmitter<[string, Deadline]>();
	public form: FormGroup;
	get displayForm(): boolean { return this.deadlineS.displayForm; }
	get waiting(): boolean { return this.deadlineS.waiting; }

	deadlineTypes: DeadlineType[] = [];

  constructor(
  	private deadlineS: DeadlineService,
  	private projectR: ProjectsRepository,
  	private globalsS: GlobalsService,
  	public dialog: MatDialog,
  ) {
  	// this.deadlineS.deadline = this._deadline;
  }

  ngOnInit() {

  	this.projectR.deadlineTypes()
			.pipe(
        map((data: any): DeadlineType[]=>data["hydra:member"])
      )
      .subscribe((deadlineTypes: DeadlineType[]) => this.deadlineTypes = deadlineTypes)

  	this.form = this.deadlineS.form;
  	this.form.patchValue(this.getFormValue());
  }

  getFormValue() {
  	let formValue = Object.assign({}, this.deadline);
  	formValue.deadlineType = formValue.deadlineType ? formValue.deadlineType['@id'] : null;
  	return formValue;
  }

  save() {
  	this.deadlineS.submit(this.deadline)
  		.subscribe((deadline: Deadline) => {
  			this.deadlineChange.emit([this.deadline['@id'], deadline]);
  			this.deadline = deadline; 
  		});
  }

  edit() {
  	this.deadlineS.displayForm = true;
  }

  cancel() {
  	this.form.patchValue(this.getFormValue());
  	this.deadlineS.displayForm = false;
  }

  delete() {
  	const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
      	this.projectR.delete(this.deadline['@id'])
		      .pipe(
		        tap(() => this.deadlineChange.emit([this.deadline['@id'], null])),
		        tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"}))
		      )
		      .subscribe(() => this.deadline = null);
        //this.deadlineS.delete(this.deadline['@id']);
      }
    });
  }

}
