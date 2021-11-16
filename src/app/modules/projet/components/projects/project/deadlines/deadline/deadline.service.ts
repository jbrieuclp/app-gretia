import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { tap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared';
import { ProjectsRepository } from '../../../../../repository/projects.repository';
import { ProjectService } from '../../project.service';

@Injectable({
  providedIn: 'root'
})
export class DeadlineService {

	public form: FormGroup;
	public waiting: boolean = false;
	public displayForm: boolean = false;

  constructor(
  	private fb: FormBuilder,
    private globalsS: GlobalsService,
  	private projectR: ProjectsRepository,
    private projectS: ProjectService,
  ) { 
  	this.initForm();
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      deadlineType: [null, [Validators.required]],
      date: [null, [Validators.required]],
      comment: null,
      isReported: false,
      isObsolete: false,
    });
  }

  submit(deadline = null) {
  	this.waiting = true;
  	let api;
  	if ( deadline !== null ) {
  		api = this.projectR.patch(deadline['@id'], this.form.value);
  	} else {
  		api = this.projectR.postDeadlines(
                  Object.assign(
                    {project: this.projectS.project.getValue()['@id']}, 
                    this.form.value
                  )
                );
  			
  	}

  	return api.pipe(
  				tap(() => {
  					this.waiting = false;
  					this.displayForm = false;
            this.globalsS.snackBar({msg: "Enregistrement effectué"});
  				})
  			)
  }
}
