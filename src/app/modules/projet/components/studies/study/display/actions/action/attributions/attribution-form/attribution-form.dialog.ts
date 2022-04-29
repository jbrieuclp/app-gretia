import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";

import { ActionsRepository } from '@projet/repository/actions.repository';
import { Action, ActionAttribution } from '@projet/repository/project.interface';
import { StudiesRepository } from '@projet/repository/studies.repository';
import { ActionService } from '../../action.service';

@Component({
  selector: 'app-projet-actions-action-attribution-form',
  templateUrl: './attribution-form.dialog.html',
  styleUrls: ['./attribution-form.dialog.scss']
})
export class ActionAttributionFormDialog implements OnInit {

	attribution: ActionAttribution;
	form: FormGroup;
	waiting: boolean = false;
  get action(): Action { return this.actionS.action.getValue(); };

	@Output() onSubmit: EventEmitter<any> = new EventEmitter();

  constructor(
    public dialogRef: MatDialogRef<ActionAttributionFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  	private actionR: ActionsRepository,
    private actionS: ActionService,
  ) { 
    this.attribution = data.attribution
  }

  ngOnInit() {

  	this.initForm();

  	if (this.attribution['@id']) {
  		this.form.patchValue(this.attribution);
  	}
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      employee: [null, Validators.required],
      nbOfDays: [null, [Validators.required, Validators.max(this.getMaxDay())]]
    });
  }

  submit(): void {   
    this.waiting = true;
    let api;

    if (this.attribution['@id']) {
      //update
      api = this.actionR.patch(
        this.attribution['@id'],
        Object.assign(this.attribution, this.form.value)
      )
        .pipe(
        	tap((attribution: ActionAttribution) => this.attribution = attribution)
      	)
    } else {
      // create
      api = this.actionR
        .addAttribution(Object.assign(this.attribution, this.form.value));
    }

    api
    	.pipe(
        tap((): void => {
          this.waiting = false;
          this.form.reset();
        }),
      )
      .subscribe(
        () => this.dialogRef.close(true),
        (err) => this.waiting = false
      );
  }

  getMaxDay(): number {
    let max = this.action.nbOfDays;

    this.action.attributions.forEach(e => {
      if (this.attribution['@id'] !== e['@id']) {
        max -= e.nbOfDays;
      }
    });

    return max;
  }

  cancel() {
    this.form.reset(); 
    this.dialogRef.close(false);
  }

}
