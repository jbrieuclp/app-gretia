import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from "@angular/forms";
import { map, tap } from "rxjs/operators";

import { Action } from '@projet/repository/project.interface';
import { StudyActionsService } from '../../actions.service';
import { ActionsRepository } from '@projet/repository/actions.repository';

@Component({
  selector: 'app-project-action-objective-assignment',
  templateUrl: './objective-assignment.dialog.html'
})
export class ActionObjectiveAssignmentDialog implements OnInit {

  get objectives() { return this.studyActionsS.objectives.getValue(); }
  get loading(): boolean { return this.studyActionsS.loading; };

  objectiveForm: FormControl = new FormControl(null, [Validators.required]);
  action: Action;
  saving: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ActionObjectiveAssignmentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studyActionsS: StudyActionsService,
    private actionR: ActionsRepository,
  ) { }

  ngOnInit() {
    this.action = this.data.action;
  }

  submit() {
    if (this.objectiveForm.valid) {
      this.saving = true;
      this.actionR.patch(
        this.action['@id'],
        {objective: this.objectiveForm.value}
      )
      .pipe(
        tap(() => this.saving = false),
        tap((action: Action) => Object.assign(this.action, action)),
      )
      .subscribe(() => this.cancel());
    }
  }

  cancel() {
    this.objectiveForm.reset(); 
    this.dialogRef.close(false);
  }

}
