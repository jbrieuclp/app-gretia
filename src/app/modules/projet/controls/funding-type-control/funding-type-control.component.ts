import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Observable, Subscription } from 'rxjs';
import { filter, tap, map, debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
// import { dateFundingTypeValidator } from './date-project-type.validator';

import * as moment from 'moment';

import { AbstractControl } from '../abstract.control';
import { FundingTypeRepository } from '../../repository/funding-type.repository';
import { FundingType } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-funding-type-control',
  templateUrl: './funding-type-control.component.html',
  styleUrls: ['./funding-type-control.component.scss']
})
export class FundingTypeControlComponent extends AbstractControl implements OnInit, OnDestroy {

  @Input() dateFilter: Date;
  fundingTypes: FundingType[] = [];
  loading: boolean = false;


  constructor(
  	private fundingTypeR: FundingTypeRepository
  ) { 
    super()
  }

  ngOnInit() {
    super.ngOnInit();
    
    this._subscriptions.push(
      this.getFundingTypes(this.dateFilter)
        .pipe(
          map(date => date === null ? [] : date),
          distinctUntilChanged(),
        )
        .subscribe((fundingTypes: FundingType[])=>this.fundingTypes = fundingTypes)
    );
  }

  private getFundingTypes(date): Observable<FundingType[]> {
    this.loading = true;
    return this.fundingTypeR.fundingTypes({
              "applicationStart[before]": moment(date).format('yyyy-MM-DD'),
              "applicationEnd[after]": moment(date).format('yyyy-MM-DD')
            })
            .pipe(
              map((data: any): FundingType[]=>data["hydra:member"]),
              tap(() => this.loading = false)
            );
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
