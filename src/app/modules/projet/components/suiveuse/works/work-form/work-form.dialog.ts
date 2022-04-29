import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Observable, of, BehaviorSubject, Subscription } from "rxjs";
import { tap, map, switchMap, distinctUntilChanged, debounceTime, filter } from "rxjs/operators";
import { Location } from '@angular/common'; 
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { GlobalsService } from '../../../../../../shared/services/globals.service';
import { SuiveuseService } from '../../suiveuse.service';
import { WorksRepository } from '../../../../repository/works.repository';
import { Work } from '../../../../repository/project.interface';
import { WorkFormService } from './work-form.service';
import { WorkingTimeResultsService } from '../../result/results.service';

@Component({
  selector: 'app-projet-suiveuses-work-form',
  templateUrl: './work-form.dialog.html',
  styleUrls: ['./work-form.dialog.scss']
})
export class WorkFormDialog implements OnInit, OnDestroy {

  form: FormGroup;
	$date: Observable<Date>
	$dateSub: Subscription;
  saving: boolean = false;
  oldDateSaveBeforeUpdate: Date = null;
  today: Date = new Date();
  get work(): Work { return this.workFormS.work.getValue(); };

  get selectedDate() { return this.suiveuseS.selectedDate.getValue(); };

  constructor(
  	private fb: FormBuilder,
    public dialogRef: MatDialogRef<WorkFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  	private location: Location,
  	private suiveuseS: SuiveuseService,
  	private workR: WorksRepository,
    private globalS: GlobalsService,
    private workFormS: WorkFormService,
    private workingTimeResultsS: WorkingTimeResultsService,
  ) { 
  	this.$date = suiveuseS.selectedDate.asObservable();
    this.workFormS.work.next(this.data.work);
  }

  ngOnInit() {
  	this.initForm();
  	this.setObservables();
  }

  initForm(): void {
    //FORM
    this.form = this.workFormS.form;
  }

  /**
   * Initialise les observables pour la mise en place des actions automatiques
   **/
  private setObservables() {

    //patch le form par les valeurs par defaut si creation
    this.$dateSub = this.$date
      .pipe(
        distinctUntilChanged(),
        map((date) => moment(date).format('YYYY-MM-DD'))
      )
      .subscribe((date: string) => this.form.get('workingDate').setValue(date));
  }

  save() {
    this.saving = true;
    let data = Object.assign((this.work !== null ? this.work : {}), this.form.value);

    let api = (data['@id'] ? this.workR.patch(data['@id'], data) : this.workR.postMyWorks(data));
    api.pipe(
      tap(() => this.saving = false),
      tap((work) => {
        //update
        if (this.work !== null) {
          Object.assign(this.work, work);
        } else {
          this.workingTimeResultsS.works.push(work);
        }
      }),
      tap(() => {
        //si la date a été changé on refresh la calendrier pour l'ancienne date
        if (this.oldDateSaveBeforeUpdate !== null) {
          this.suiveuseS.refreshDayData(moment(this.oldDateSaveBeforeUpdate).format('YYYY-MM-DD'));
        }
      }),
      tap((work) => this.suiveuseS.refreshDayData(work.workingDate)),
      tap(() => this.reset()),
		)
    .subscribe(
      () => this.globalS.snackBar({msg: "Travail "+(data['@id'] ? 'modifié' : 'ajouté')}),
      err => {this.saving = false;}
    )
  }

  reset() {
    this.workFormS.work.next(null);
    this.dialogRef.close();
  }

  ngOnDestroy() {
  	this.$dateSub.unsubscribe();
  }

}