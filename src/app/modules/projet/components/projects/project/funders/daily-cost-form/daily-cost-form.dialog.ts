import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from "@angular/forms";
import { tap, map } from "rxjs/operators";

import { GlobalsService } from '../../../../../../../shared';
import { ProjectsRepository } from '../../../../../repository/projects.repository';
import { Project } from '../../../../../repository/project.interface';
import { ProjectService } from '../../project.service';

@Component({
  selector: 'app-projet-project-daily-cost-form-dialog',
  templateUrl: './daily-cost-form.dialog.html'
})
export class DailyCostFormDialog implements OnInit {

  public form: FormControl = new FormControl('', [Validators.required]);
  get project(): Project { return this.projectS.project.getValue(); };
  waiting: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<DailyCostFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private projectR: ProjectsRepository,
    private projectS: ProjectService,
    private globalsS: GlobalsService,
  ) { }

  ngOnInit() {
    this.projectS.project.asObservable()
      .subscribe((project: Project) => this.form.setValue(project.dailyCost));
  }

  submit(): void {
    this.waiting = true;
    this.projectR.patch(this.project['@id'], {"dailyCost": this.form.value})
      .pipe(
        tap(() => {
          this.waiting = false;
          this.globalsS.snackBar({msg: "Enregistrement effectué"});
        }),
        tap((project: Project) => this.projectS.project.next(project))
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  cancel(): void {
    this.form.reset();
    this.dialogRef.close(false);
  }
}
