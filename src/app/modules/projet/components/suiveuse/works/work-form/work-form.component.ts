import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { Observable, of, BehaviorSubject, Subscription } from "rxjs";
import { tap, map, switchMap, distinctUntilChanged, debounceTime, filter } from "rxjs/operators";
import { Location } from '@angular/common'; 
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { GlobalsService } from '../../../../../../shared/services/globals.service';
import { SuiveuseService } from '../../suiveuse.service';
import { WorksRepository } from '../../../../repository/works.repository';
import { Work, Travel, Expense } from '../../../../repository/project.interface';
import { WorkService } from '../work.service';
import { WorkFormService } from './work-form.service';
import { TravelFormDialog } from './travel-form/travel-form.dialog';
import { WorkExpenseFormDialog } from './expense-form/expense-form.dialog';

@Component({
  selector: 'app-projet-suiveuses-work-form',
  templateUrl: './work-form.component.html',
  styleUrls: ['./work-form.component.scss']
})
export class WorkFormComponent implements OnInit, OnDestroy {

  form: FormGroup;
	$date: Observable<Date>
	$dateSub: Subscription;
  saving: boolean = false;
  get work(): Work { return this.workFormS.work.getValue(); };
  get travels(): Travel[] { return this.workFormS.travels }
  get expenses(): Expense[] { return this.workFormS.expenses }

  constructor(
  	private fb: FormBuilder,
    public dialog: MatDialog,
  	private location: Location,
  	private suiveuseS: SuiveuseService,
  	private workR: WorksRepository,
    private workS: WorkService,
    private globalS: GlobalsService,
    private workFormS: WorkFormService,
  ) { 
  	this.$date = suiveuseS.selectedDate.asObservable();
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
        tap((date) =>  this.reset()),
        map((date) => moment(date).format('YYYY-MM-DD'))
      )
      .subscribe((date: string) => this.form.get('workingDate').setValue(date));
  }

  addTravel() {
    this.openTravelFormDialog();
  }

  editTravel(travel) {
    this.openTravelFormDialog(travel);
  }

  private openTravelFormDialog(travel = {}) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      'travel': travel,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(TravelFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((travel: Travel) => travel !== null),
        filter((travel: Travel) => this.travels.findIndex(e => e === travel) === -1)
      )
      .subscribe((travel: Travel) => this.travels.push(travel));
  }

  addExpense() {
    this.openExpenseFormDialog();
  }

  editExpense(idx) {
    let expense = this.expenses.splice(idx, 1)[0];
    this.openExpenseFormDialog(expense);
  }

  private openExpenseFormDialog(expense = {}) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      'expense': expense,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(WorkExpenseFormDialog, dialogConfig);
  }

  private pushExpense(expense: Expense): void {
    this.expenses.push(expense);
  }

  save() {
    this.saving = true;
    let data = Object.assign({}, (this.work !== null ? this.work : {}), this.form.value);
    data.travels = this.travels;
    data.expenses = this.expenses;

    let api = (data['@id'] ? this.workR.patch(data['@id'], data) : this.workR.postMyWorks(data));
    api.pipe(
      tap(() => this.saving = false),
      tap((work) => {
        //update
        if (this.work !== null) {
          Object.assign(this.work, work);
        } else {
          this.workS.works.push(work);
        }
      }),
      tap(() => this.reset()),
      // tap(() => this.workS.refreshWorks(this.suiveuseS.selectedDate.getValue())),
      tap((work) => this.suiveuseS.refreshDayData(work.workingDate)),
		)
    .subscribe(() => this.globalS.snackBar({msg: "Travail "+(data['@id'] ? 'modifié' : 'ajouté')}))
  }

  reset() {
    this.workFormS.reset();
    this.workFormS.work.next(null);
  }

  ngOnDestroy() {
  	this.$dateSub.unsubscribe();
  }

}