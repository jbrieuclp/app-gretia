import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { tap, map, switchMap } from "rxjs/operators";

import { GlobalsService } from '../../../../../../../shared';
import { ProjectsRepository } from '../../../../../repository/projects.repository';
import { Organism, Signatory } from '../../../../../repository/project.interface';
import { ProjectService } from '../../project.service';
import { ProjectSignatoriesService } from '../signatories.service';

@Component({
  selector: 'app-projet-project-signatory-form',
  templateUrl: './signatory-form.dialog.html',
})
export class SignatoryFormDialog implements OnInit {

  public form: FormGroup;
  signatory: Signatory = null;
  waiting: boolean = false;
  get signatories(): Organism[] { 
    return this.projectSignatoriesS.signatories
              .filter(f => this.signatory === null || f['@id'] !== this.signatory['@id'])
              .map(f => f.organism); 
  };

  constructor(
    public dialogRef: MatDialogRef<SignatoryFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private projectR: ProjectsRepository,
    private projectS: ProjectService,
    private globalsS: GlobalsService,
    private projectSignatoriesS: ProjectSignatoriesService,
  ) { 
    this.signatory = data.signatory;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      organism: [null, [Validators.required, Validators.pattern('^\/api\/project\/organisms\/[0-9]+$')]],
    });

    if (this.signatory !== null) {
      this.form.patchValue(this.signatory);
    } else {
      this.form.patchValue({});
    }
  }

  submit(): void {
    this.waiting = true;
    let api;
    if ( this.signatory !== null ) {
      api = this.projectR.patch(this.signatory['@id'], this.form.value);
    } else {
      api = this.projectR.postSignatories(
                  Object.assign(
                    {project: this.projectS.project.getValue()['@id']}, 
                    this.form.value
                  )
                );
    }

    api
      .pipe(
        switchMap(() => this.projectSignatoriesS.getSignatories(this.projectS.project.getValue()['id'])),
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
}
