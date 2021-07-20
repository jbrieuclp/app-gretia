import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { tap } from "rxjs/operators";

import { dateProjectTypeAsyncValidator } from '../../../../controls/project-type-control/date-project-type.validator';
import { ProjetService } from '../projet.service';
import { ProjectTypeRepository } from '../../../../repository/project-type.repository';
import { ProjetRepository, Projet } from '../../../../repository/projet.repository';

@Component({
  selector: 'app-projet-projet-form',
  templateUrl: './projet-form.dialog.html',
  styleUrls: ['./projet-form.dialog.scss']
})
export class ProjetFormDialog implements OnInit {

  public form: FormGroup;
  public waiting: boolean = false;

  get projet() {
		return this.projetS.projet.getValue();
	}

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjetFormDialog>,
  	private projetS: ProjetService,
    private projectTypeR: ProjectTypeRepository,
    private projetR: ProjetRepository,
  ) { }

  ngOnInit() {
  	this.form = this.fb.group({
      intitule: [null, Validators.required],
      localAttachment: [null, Validators.required],
      objectif: [null],
      dateDebut: [null, Validators.required],
      dateFin: [null],
      groupeTaxo: [null],
      milieu: [null],
      projectType: [null, Validators.required/*, [dateProjectTypeAsyncValidator('dateDebut', this.projectTypeR)]*/],
      // localisations: this.fb.array([], Validators.required),
      // responsables: this.fb.array([], Validators.required),
    });

    this.form.patchValue(this.projet || {});
  // }
  }

  cancel() {
    this.form.reset(); 
    this.dialogRef.close(false);
  }

  submit(): void {   
    this.waiting = true;
    let api;
    if (this.projet) {
      //update
      api = this.projetR
        .patch(
          this.projet['@id'], 
          Object.assign(this.projet, this.form.value)
        );
        
    } else {
      //create
      api = this.projetR.createProjet(this.form.value);
    }

    api
      .pipe(
        tap(()=>this.waiting = false)
      )
      .subscribe(
      (projet: Projet) => {console.log("ici");this.projetS.projet.next(projet)},
      (err) => {
        this.waiting = false;
        if ( err.status = 422) {
          err.error.violations.forEach(e => {
            if ( this.form.get(e.propertyPath) !== null)
              this.form.get(e.propertyPath).setErrors({invalide: true, message: e.message});
          });
        }
      },
      (projet) => this.dialogRef.close(projet)
    );
  }

  // save() {
  // 	this.projetS.submit();
  // }

  // cancel() {
  //   this.projetS.reset();
  //   this.projetS.displayForm = false;
  // }

  // get tacheControls() {
  //   return (this.form.get("taches") as FormArray)
  //     .controls;
  // }

  // get responsables() {
  //   return this.projetS.responsables;
  // }

  // addResponsable() {
  // 	this.projetS.addResponsable();
  // }

  // removeResponsable(i: number) {
  // 	this.projetS.removeResponsable(i);
  // }

  // get localisations() {
  //   return this.projetS.localisations;
  // }

  // addLocalisation() {
  // 	this.projetS.addLocalisation();
  // }

  // removeLocalisation(i: number) {
  // 	this.projetS.removeLocalisation(i);
  // }

}
