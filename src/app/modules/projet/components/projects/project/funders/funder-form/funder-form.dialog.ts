import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { tap, map, switchMap } from "rxjs/operators";

import { GlobalsService } from '../../../../../../../shared';
import { ProjectsRepository } from '../../../../../repository/projects.repository';
import { Organism, Funder, Project } from '../../../../../repository/project.interface';
import { ProjectService } from '../../project.service';
import { ProjectFundersService } from '../funders.service';
import { FundingTypeRepository } from '../../../../../repository/funding-type.repository';

@Component({
  selector: 'app-projet-project-funder-form-dialog',
  templateUrl: './funder-form.dialog.html'
})
export class FunderFormDialog implements OnInit {

  public form: FormGroup;
  funder: Funder = null;
  waiting: boolean = false;
  get funders(): Organism[] { 
    return this.projectFundersS.funders
              .filter(f => this.funder === null || f['@id'] !== this.funder['@id'])
              .map(f => f.organism); 
  };
  get project(): Project { return this.projectS.project.getValue(); };

  constructor(
    public dialogRef: MatDialogRef<FunderFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  	private fb: FormBuilder,
    private projectR: ProjectsRepository,
    private projectS: ProjectService,
    private globalsS: GlobalsService,
    private projectFundersS: ProjectFundersService,
    private fundingTypeR: FundingTypeRepository,
  ) { 
    this.funder = data.funder;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      organism: [null, [Validators.required, Validators.pattern('^\/api\/project\/organisms\/[0-9]+$')]],
      funding: [null, [Validators.required, Validators.pattern('^[0-9\.]+$')]],
      fundingType: [null, Validators.required/*, [dateFundingTypeAsyncValidator('dateDebut', this.fundingTypeR)]*/],
    });

    if (this.funder !== null) {
      this.form.patchValue(this.funder);
    } else {
      this.form.patchValue({});
    }
  }

  submit(): void {
    this.waiting = true;
    let api;
    if ( this.funder !== null ) {
      api = this.projectR.patch(this.funder['@id'], this.form.value);
    } else {
      api = this.projectR.postFunders(
                  Object.assign(
                    {project: this.projectS.project.getValue()['@id']}, 
                    this.form.value
                  )
                );
    }

    api
      .pipe(
        switchMap(() => this.projectFundersS.getFunders(this.projectS.project.getValue()['id'])),
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
