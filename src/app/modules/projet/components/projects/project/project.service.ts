import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { filter, tap, map, switchMap, skip, catchError, distinctUntilChanged } from 'rxjs/operators';

import { ProjectsRepository } from '../../../repository/projects.repository';
import { Project } from '../../../repository/project.interface';
import { GlobalsService } from '@shared/services/globals.service';

@Injectable()
export class ProjectService {

	public project_id: BehaviorSubject<number> = new BehaviorSubject(null);
  public project: BehaviorSubject<Project> = new BehaviorSubject(null);
	// public form: FormGroup;

	public loadingProject: boolean = false;
	public displayForm: boolean = false;

  constructor(
  	// private fb: FormBuilder,
    private router: Router,
  	private projectR: ProjectsRepository,
    private globalsS: GlobalsService,
  ) { 
  	// this.initForm();
  	this.setObservables();
  }

  private setObservables() {
    //recuperation des info du projet à partir de l'ID de l'URL
    this.project_id.asObservable()
      .pipe(
        filter((id) => id !== null),
        filter((id) => this.project.getValue() === null || id !== this.project.getValue().id),
        switchMap((id: number) => this.getProject(id)),
      )
      .subscribe(
        (project: Project) => this.project.next(project),
        (err) => {
          this.globalsS.snackBar({msg: `${err.status} - ${err.statusText}`, color: 'red'});
          this.router.navigate(['/projet/projets']);
        }
      );
  }

  getProject(id): Observable<Project> {
    this.loadingProject = true;
    return this.projectR.project(id)
      .pipe(
        tap(() => this.loadingProject = false),
      )
  }

  // initForm(): void {
  //   //FORM
  //   this.form = this.fb.group({
  //     intitule: [null, Validators.required],
  //     description: [null]
  //   });
  // }

  // setObservable() {
  // 	this.project.asObservable()
  // 		.pipe(
  //       tap(() => this.form.reset()),
  // 			map((project: Project) => project !== null ? project : {}),
  // 		)
  // 		.subscribe((project: Project) => this.form.patchValue(project));
  // }

  // submit() {
  // 	this.loading = true;
  // 	let api;
  // 	if ( this.project.getValue() ) {
  // 		api = this.projectR.patch(this.project.getValue()['@id'], Object.assign(this.project.getValue(), this.form.value));
  // 	} else {
  // 		api = this.projectR.postProjects(this.form.value);
  			
  // 	}

  // 	api.pipe(
  // 				tap((project: Project) => this.project.next(project)),
  // 				map((project: Project): Number => project.id),
  // 				tap(() => {
  // 					this.loading = false;
  // 					this.displayForm = false;
  // 				})
  // 			)
  // 			.subscribe(id => this.location.replaceState(`/projet/projets/${id}`));
  // }
}
