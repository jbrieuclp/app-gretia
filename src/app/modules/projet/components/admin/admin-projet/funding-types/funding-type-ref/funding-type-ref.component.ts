import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared';
import { FundingTypeRefService } from '../funding-type-ref.service';
import { FundingTypeService } from './funding-type.service';
import { FundingTypeRepository } from '../../../../../repository/funding-type.repository';
import { FundingTypeRef } from '../../../../../repository/project.interface';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-admin-funding-type-ref',
  templateUrl: './funding-type-ref.component.html',
  styles: ['table .mat-icon-button { height: 24px; line-height: 24px; }']
})
export class FundingTypeRefComponent implements OnInit, AfterViewChecked {

  private _subscriptions: Subscription[] = [];
	public fundingTypeRef: FundingTypeRef = null;
	public loading: boolean = false;
  public displayForm: boolean = false;

  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  constructor(
    private fundingTypeRefS: FundingTypeRefService,
    private fundingTypeR: FundingTypeRepository,
    private fundingTypeS: FundingTypeService,
    private globalsS: GlobalsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.fundingTypeRefS.fundingTypeRef.asObservable()
        .pipe(
          distinctUntilChanged(),
          tap(() => {
            this.fundingTypeRef = null;
            this.displayForm = false;
          }),
          filter((fundingTypeRef: FundingTypeRef) => fundingTypeRef !== null),
          switchMap((fundingTypeRef: FundingTypeRef) => this.getFundingTypeRef(fundingTypeRef))
        )
        .subscribe((fundingTypeRef: FundingTypeRef) => this.fundingTypeRef = fundingTypeRef)
    );

  }

  ngAfterViewChecked() {
    if (this.stepper !== undefined) {
      this.fundingTypeS.stepper = this.stepper;
    }
  }

  getFundingTypeRef(fundingTypeRef): Observable<FundingTypeRef> {
  	this.loading = true;
  	return this.fundingTypeR.get(fundingTypeRef['@id'])
  		.pipe(
  			tap(() => this.loading = false)
  		);
  }

  delete(fundingTypeRef: FundingTypeRef) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de ${fundingTypeRef.label} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.fundingTypeRefS.delete(fundingTypeRef);
      }
    }); 
  }

  refreshFundingTypeRef() {
    this.getFundingTypeRef(this.fundingTypeRef)
      .subscribe((fundingTypeRef: FundingTypeRef) => this.fundingTypeRef = fundingTypeRef);
  }

  addFundingType() {
    this.fundingTypeS.fundingType.next(null);
    this.fundingTypeS.moveStepper(1);
  }

  editRow(fundingType) {
    this.fundingTypeS.fundingType.next(fundingType);
    this.fundingTypeS.moveStepper(1);
  }

  deleteRow(fundingType) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.fundingTypeR.delete(fundingType['@id'])
          .pipe(
            tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"}))
          )
          .subscribe(() => this.refreshFundingTypeRef());
      }
    });
  }

}
