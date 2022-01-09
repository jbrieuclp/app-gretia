import { Component, OnInit, Input, Inject } from '@angular/core';
import { AUTO_STYLE, animate, state, style, transition, trigger } from '@angular/animations';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { map, filter, tap } from 'rxjs/operators';
import _ from 'lodash';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { GlobalsService } from '../../../../../../shared/services/globals.service';
import { Travel, ChargeType } from '../../../../repository/project.interface';
import { WorksRepository } from '../../../../repository/works.repository';
import { TravelFormService } from './travel-form.service';
import { SuiveuseService } from '../../suiveuse.service';
import { WorkingTimeResultsService } from '../../result/results.service';

const DEFAULT_DURATION = 300;

@Component({
  selector: 'app-projet-work-travel-form-dialog',
  templateUrl: './travel-form.dialog.html',
  styleUrls: ['./travel-form.dialog.scss'],
  animations: [
    trigger('collapse', [
      state('true', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('false', style({ height: '0', visibility: 'hidden' })),
      transition('true => false', animate(DEFAULT_DURATION + 'ms ease-in')),
      transition('false => true', animate(DEFAULT_DURATION + 'ms ease-out'))
    ])
  ]
})
export class TravelFormDialog implements OnInit {

  form: FormGroup;
  expenseForm: FormGroup;
  travelKMCost: BehaviorSubject<number> = new BehaviorSubject(null);
  chargeTypeLoading: boolean = false;
  subscriptions: Subscription[] = [];
  saving: boolean = false;

  get travel(): Travel { return this.travelFormS.travel.getValue(); };
  get day() { return moment(this.suiveuseS.selectedDate.getValue()).format('YYYY-MM-DD') };

  constructor(
    public dialogRef: MatDialogRef<TravelFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private workR: WorksRepository,
    private globalS: GlobalsService,
    private travelFormS: TravelFormService,
    private suiveuseS: SuiveuseService,
    private workingTimeResultsS: WorkingTimeResultsService,
  ) { 
    this.travelFormS.travel.next(this.data.travel);
  }

  ngOnInit() {
    this.form = this.travelFormS.form;
  }

  save() {
    this.saving = true;
    let data = Object.assign((this.travel !== null ? this.travel : {}), this.form.value);

    let api = (data['@id'] ? this.workR.patch(data['@id'], data) : this.workR.postMyTravels(data));
    api.pipe(
      tap(() => this.saving = false),
      tap((travel) => {
        //update
        if (this.travel !== null) {
          Object.assign(this.travel, travel);
        } else {
          this.workingTimeResultsS.travels.push(travel);
        }
      }),
      tap((travel) => this.suiveuseS.refreshDayData(travel.travelDate)),
      tap(() => this.globalS.snackBar({msg: "Travail "+(data['@id'] ? 'modifié' : 'ajouté')})),
    )
    .subscribe(
      () => this.close(),
      err => this.saving = false
    );
  }

  close() {
    this.travelFormS.reset();
    this.dialogRef.close();
  }
}
