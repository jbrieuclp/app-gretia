import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { tap, map, switchMap, filter } from "rxjs/operators";

import { GlobalsService } from '../../../../../../../shared';
import { ProjectsRepository } from '../../../../../repository/projects.repository';
import { StudiesRepository } from '../../../../../repository/studies.repository';
import { Study, StudyFunding } from '../../../../../repository/project.interface';
import { ProjectService } from '../../project.service';
import { ProjectStudiesFundingsService } from '../studies-fundings.service';
import { StudyFormDialog } from '../../../../studies/study/form/study-form.dialog';

@Component({
  selector: 'app-projet-project-study-funding-form-dialog',
  templateUrl: './study-funding-form.dialog.html'
})
export class StudyFundingFormDialog implements OnInit {

  public form: FormGroup;
  studyFunding: StudyFunding = null;
  waiting: boolean = false;
  get studiesDisabled(): Study[] { 
    return this.projectStudiesFundingsS.studiesFundings
              .filter(sf => this.studyFunding === null || sf['@id'] !== this.studyFunding['@id'])
              .map(sf => sf.study); 
  };
  studiesOptions: Study[] = [];

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<StudyFundingFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private projectR: ProjectsRepository,
    private projectS: ProjectService,
    private globalsS: GlobalsService,
    private projectStudiesFundingsS: ProjectStudiesFundingsService,
    private studiesR: StudiesRepository,
  ) { 
    this.studyFunding = data.studyFunding;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      study: [null, [Validators.required]],
      eligibleFunding: [null, [Validators.required]],
    });

    if (this.studyFunding !== null) {
      this.form.patchValue(this.studyFunding);
    } else {
      this.form.patchValue({});
    }
  }

  submit(): void {
    this.waiting = true;
    let api;
    if ( this.studyFunding !== null ) {
      api = this.projectR.patch(this.studyFunding['@id'], this.form.value);
    } else {
      api = this.projectR.postStudyFunding(
                  Object.assign(
                    {project: this.projectS.project.getValue()['@id']}, 
                    this.form.value
                  )
                );
    }

    api
      .pipe(
        switchMap(() => this.projectStudiesFundingsS.getStudiesFundings(this.projectS.project.getValue()['id'])),
        tap(() => {
          this.waiting = false;
          this.globalsS.snackBar({msg: "Enregistrement effectué"});
        })
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  cancel(): void {
    this.form.reset();
    this.dialogRef.close(false);
  }

  createStudy() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(StudyFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((study: Study) => study !== null),
        tap((study: Study) => this.form.get('study').setValue(study)),
        switchMap(() => this.studiesR.studies_select()),
        map((data: any): Study[]=>data["hydra:member"])
      )
      .subscribe((studies) => this.studiesOptions = studies);
  }
}
