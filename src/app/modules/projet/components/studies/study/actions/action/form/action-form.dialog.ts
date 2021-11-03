import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormArray } from "@angular/forms";
import { BehaviorSubject } from 'rxjs';;

import { ActionFormService } from './action-form.service';
import { StudyMontagesService } from '../../../montages/montages.service';
import { ActionService } from '../action.service';
import { StudyActionsService } from '../../actions.service';
import { Study, Charge, Action } from '../../../../../../repository/project.interface';
import { GlobalsService } from '../../../../../../../../shared/services/globals.service';

@Component({
  selector: 'app-projet-action-form',
  templateUrl: './action-form.dialog.html',
  styleUrls: ['./action-form.dialog.scss']
})
export class ActionFormDialog implements OnInit {

	form: FormGroup;
  
  get availableDays(): number { return this.actionFormS.availableDays; };

	get action() {
		return this.actionS.action;
	}
  get charges(): Charge[] {
    return this.studyMontagesS.charges.getValue();
  }

  get associatedCharges(): Charge[] {
    return this.charges.filter(c => c.chargeType.chargeTypeRef.isPerDay === true);
  }

  get loadingCharges(): boolean { return this.studyMontagesS.loading; };
  get waiting(): boolean { return this.actionFormS.waiting; };

  constructor(
    public dialogRef: MatDialogRef<ActionFormDialog>,
  	private actionFormS: ActionFormService,
    private studyMontagesS: StudyMontagesService,
    private actionS: ActionService,
    private studyActionsS: StudyActionsService,
    private globalsS: GlobalsService
  ) { }

  ngOnInit() {
  	this.form = this.actionFormS.form;
    this.actionFormS.patchForm();
  }

  submit() {
    this.actionFormS.submit()
    .subscribe(
        () => {this.dialogRef.close(true)},
        (err) => {
          
          //this._commonService.translateToaster("error", "ErrorMessage");
        }
      );
    ;
  }

  cancel() {
    this.form.reset(); 
    this.dialogRef.close(false);
  }
}
