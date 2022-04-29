import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from "@angular/forms";
import { map, tap } from "rxjs/operators";

import { StudyService } from '../../../../study.service';
import { ObjectiveFormService } from './objective-form.service';
import { Action, Objective } from '@projet/repository/project.interface';
import { StudyActionsService } from '../../actions.service';
import { ActionsRepository } from '@projet/repository/actions.repository';

@Component({
  selector: 'app-project-action-objective-form',
  templateUrl: './objective-form.dialog.html',
  styleUrls: ['./objective-form.dialog.scss']
})
export class ActionObjectiveFormDialog implements OnInit {

  get study() { return this.studyS.study.getValue(); }
  get objective() { return this.objectiveFormS.objective.getValue(); }
  form: FormGroup;
  waiting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ActionObjectiveFormDialog>,
    private studyS: StudyService,
    private objectiveFormS: ObjectiveFormService,
    private studyActionsS: StudyActionsService,
    private actionR: ActionsRepository,
  ) { }

  ngOnInit() {
    this.form = this.objectiveFormS.form;
  }

  submit() {
    this.waiting = true;

    let api;
    if (this.objective) {
      //update
      api = this.actionR.patch(
              this.objective['@id'],
              this.form.value
            )
              .pipe(
                map((objective: Objective): Objective => Object.assign(this.objective, objective)),
              );
    } else {
      //create
       api = this.actionR.createObjective(this.form.value)
              .pipe(
                tap((objective: Objective) => this.studyActionsS.objectives.getValue().push(objective)),
              );
    }

    api.subscribe(() => this.waiting = false);
  }

  cancel() {
    this.form.reset(); 
    this.dialogRef.close(false);
  }

}
