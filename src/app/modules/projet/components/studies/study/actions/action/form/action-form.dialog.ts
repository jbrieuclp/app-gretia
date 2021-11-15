import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray } from "@angular/forms";
import { BehaviorSubject } from 'rxjs';;

import { ActionFormService } from './action-form.service';
import { ActionService } from '../action.service';
import { StudyActionsService } from '../../actions.service';
import { Study, Charge, Action, Objective } from '../../../../../../repository/project.interface';
import { GlobalsService } from '../../../../../../../../shared/services/globals.service';

@Component({
  selector: 'app-projet-action-form',
  templateUrl: './action-form.dialog.html',
  styleUrls: ['./action-form.dialog.scss']
})
export class ActionFormDialog implements OnInit {

	form: FormGroup;
  
	get action() {
		return this.actionS.action.getValue();
	}
  get objectives(): Objective[] {
    return this.studyActionsS.objectives.getValue();
  }

  get loading(): boolean { return this.studyActionsS.loading; };
  get saving(): boolean { return this.actionFormS.waiting; };

  constructor(
    public dialogRef: MatDialogRef<ActionFormDialog>,
  	private actionFormS: ActionFormService,
    private actionS: ActionService,
    private studyActionsS: StudyActionsService,
    private globalsS: GlobalsService
  ) { }

  ngOnInit() {
  	this.form = this.actionFormS.form;
  }

  submit() {
    this.actionFormS.submit()
      .pipe()
      .subscribe(
        (res) => {this.dialogRef.close(true)},
        (err) => {
          //this._commonService.translateToaster("error", "ErrorMessage");
        }
      );
  }

  cancel() {
    this.form.reset(); 
    this.dialogRef.close(false);
  }
}
