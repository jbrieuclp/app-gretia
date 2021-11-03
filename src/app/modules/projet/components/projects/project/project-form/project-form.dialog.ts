import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { tap, map } from "rxjs/operators";

import { ProjectsRepository } from '../../../../repository/projects.repository';
import { Project } from '../../../../repository/project.interface';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projet-project-form-dialog',
  templateUrl: './project-form.dialog.html',
  styleUrls: ['./project-form.dialog.scss']
})
export class ProjectFormDialog implements OnInit {

	public form: FormGroup;
  public waiting: boolean = false;
  get project(): Project { return this.projectS.project.getValue(); };

  constructor(
    public dialogRef: MatDialogRef<ProjectFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  	private projectS: ProjectService,
    private projectR: ProjectsRepository,
  ) { }

  ngOnInit() {
  	this.initForm();
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      label: [null, Validators.required],
      description: [null],
      localAttachment: [null, Validators.required],
      projectType: [null, Validators.required],
      dateStart: [null, Validators.required],
      dateEnd: [null],
    });

    console.log(this.form)
  }

  submit(): void {
    this.waiting = true;

    let api;
    if ( this.project ) {
      api = this.projectR.patch(
        this.project['@id'], 
        Object.assign(this.project, this.form.value)
      )
        .pipe(
          tap((project: Project) => this.projectS.project.next(project))
        );
    } else {
      api = this.projectR.postProjects(this.form.value);
    }

    api.pipe(
      tap(() => this.waiting = false)
    )
    .subscribe(
      (project: Project) => this.dialogRef.close(project),
      err => this.waiting = false
    );
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

}
