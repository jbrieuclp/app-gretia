import { Component, OnInit, Inject, IterableDiffers, DoCheck } from '@angular/core';
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { FormGroup, Validators, FormControl, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, combineLatest } from 'rxjs';
import { tap, map, startWith, distinctUntilChanged, filter } from 'rxjs/operators';
import _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { GlobalsService } from '../../../../../../shared/services/globals.service';
import { Expense, ExpenseProof } from '../../../../repository/project.interface';
import { ExpenseFormService } from './expense-form.service';
import { WorksRepository } from '../../../../repository/works.repository';
import { SuiveuseService } from '../../suiveuse.service';
import { WorkingTimeResultsService } from '../../result/results.service';
import { SynologyService } from '@synology/synology.service';
import { SynologyRepository } from '@synology/synology.repository';

const DEFAULT_DURATION = 300;
const BASE_UPLOAD_FOLDER = '/GRETIA-Box/FONCTIONNEMENT/Suiveuses _ NDF/NDF';

@Component({
  selector: 'app-projet-expense-form',
  templateUrl: './expense-form.dialog.html',
  styleUrls: ['./expense-form.dialog.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', visibility: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class ExpenseFormDialog implements OnInit, DoCheck  {

  form: FormGroup;
  get amountTTCForm(): FormControl { return this.expenseFormS.amountTTCForm; };
  get expense(): Expense { return this.expenseFormS.expense.getValue(); };
  HTForm_visibility: boolean = false;
  saving: boolean = false;

  iterableDiffer;
  uploading: boolean = false;

  get selectedDate() { return this.suiveuseS.selectedDate.getValue(); };
  //fichiers sauvegardé
  // get files() { return this.expenseFormS.files; };
  get fileNamePrefix() { return moment(this.selectedDate).format('YYYYMMDD_'); };

  //fichiers non encore sauvegardés
  temporyFiles: any[] = [];
  get numberInputFile() { 
    const idx = this.temporyFiles.filter(e => e.file.name == "").length ? 0 : 1;
    return Array(this.temporyFiles.length + idx).fill(0).map((x,i)=>i) 
  }

  constructor(
    public dialogRef: MatDialogRef<ExpenseFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private globalS: GlobalsService,
    private workR: WorksRepository,
    private expenseFormS: ExpenseFormService,
    private suiveuseS: SuiveuseService,
    private workingTimeResultsS: WorkingTimeResultsService,
    private synologyS: SynologyService,
    private synologyR: SynologyRepository,
    private iterableDiffers: IterableDiffers
  ) { 
    this.iterableDiffer = iterableDiffers.find([]).create(null);
    this.expenseFormS.expense.next(this.data.expense);
  }

  ngDoCheck() {
    //gestion du formulaire d'ajout de fichier à coupler avec l'observable `this.files.valueChanges`
    let changes = this.iterableDiffer.diff(this.files.value);
    if (changes) {
      if (this.files.value.filter(e => !e || e === '').length > 1) {
        //pour n'avoir qu'un unique form d'ajout de fichier
        this.fileControlHandler();
      } else if (this.files.value.filter(e => !e || e === '').length === 0) {
        //ajout d'un form si un fichier est selectionné
        this.addFile();
      }
    }
}

  ngOnInit() {
    this.form = this.expenseFormS.form;

    this.amountTTCForm.enable();

    if (this.files.value.length === 0) {
      this.addFile();
    }

    this.files.valueChanges
      .pipe(
        filter(val => val.filter(e => !e || e === '').length > 1),
        distinctUntilChanged(),
      )
      .subscribe((val) => this.fileControlHandler());
  }

  get upload_subfolder() {
    const month = moment(this.selectedDate).format('M');
    const year = moment(this.selectedDate).format('YYYY');
    const trimestre = `${year}-${Math.ceil( +month / 3)}`;
    return this.synologyS.user ? `${trimestre}/${this.synologyS.user}`: null;
  }

  get proofs(): ExpenseProof[] {
    return this.expenseFormS.proofs;
  }

  get files() : FormArray {
    return this.expenseFormS.files;
  }

  addFile() {
    this.expenseFormS.addFile();
  }

  removeFile(i: number) {
    this.expenseFormS.removeFile(i);
  }

  private fileControlHandler(): void {
    for ( let i = 0; i < this.files.value.length; i++) {
      const val = this.files.value[i];
      if (!val || val === '') {
        this.removeFile(i);
        return;
      }
    }
  }

  onStateChange(file_info) {
    const idx = this.temporyFiles.findIndex(e => e.file.uuid === file_info.file.uuid);
    if ( idx === -1 ) {
      this.temporyFiles.push(file_info);
    } else {
      this.temporyFiles[idx] = file_info
    }
  }

  removeProof(i) {
    this.proofs.splice(i, 1);
  }

  sliderChange(sliderState) {
    this.HTForm_visibility = !this.HTForm_visibility;
    if (!sliderState) {
      this.amountTTCForm.enable();
      this.form.get('amountExclTax').setValidators([]);
      this.form.get('vat').setValidators([]);
    } else {
      this.amountTTCForm.disable();
      this.form.get('amountExclTax').setValidators([Validators.required]);
      this.form.get('vat').setValidators([Validators.required]);
    }
    this.form.updateValueAndValidity();
  }

  save() {
    this.saving = true;

    const params = {
      "subfolder": this.upload_subfolder,
      "sid": this.synologyS.sid,
    };

    let data = Object.assign((this.expense !== null ? this.expense : {}), this.form.value, {'proofs': this.proofs.map(e => e.id)});

    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key === 'files') {
        (value as File[]).forEach((file) => {
          if (file) {
            formData.append('file[]', <Blob> file);
          }
        })
      } else if (key === 'proofs') {
        (value as any[]).forEach((id) => {
          formData.append('proofs[]', id);
        })
      } else {
        formData.append(key, <string|Blob> value);
      }
    }

    let api = (data['@id'] ? this.workR.post(data['@id'], formData, params) : this.workR.postMyExpenses(formData, params));
    api.pipe(
      tap(() => this.saving = false),
      tap((expense) => {
        //update
        if (this.expense !== null) {
          Object.assign(this.expense, expense);
        } else {
          this.workingTimeResultsS.expenses.push(expense);
        }
      }),
      tap((expense) => this.suiveuseS.refreshDayData(expense.expenseDate)),
      tap(() => this.globalS.snackBar({msg: "Frais "+(data['@id'] ? 'modifié' : 'ajouté')})),
    )
    .subscribe(
      () => this.close(),
      err => this.saving = false
    );
  }

  close() {
    this.expenseFormS.reset();
    this.dialogRef.close();
  }

  cancel() {
    this.close();
  }
}
