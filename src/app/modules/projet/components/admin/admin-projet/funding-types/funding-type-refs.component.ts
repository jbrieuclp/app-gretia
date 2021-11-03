import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of, combineLatest } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { FundingTypeRef } from '../../../../repository/project.interface';
import { FundingTypeRefService } from './funding-type-ref.service';

@Component({
  selector: 'app-projet-admin-funding-type-refs',
  templateUrl: './funding-type-refs.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class FundingTypeRefsComponent implements OnInit {

	get fundingTypeRefs(): FundingTypeRef[] {
    return this.fundingTypeRefS.fundingTypeRefs;
  }
  private id: string;

  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  constructor(
  	public fundingTypeRefS: FundingTypeRefService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    combineLatest(
      this.route.params.pipe(
        map(p => p.fundingTypeRef), //nom du parametre dans le routing.module
        filter(id => id !== undefined),
        tap(id => this.id = id.toString()),
      ),
      this.fundingTypeRefS._fundingTypeRefs.asObservable()
    )
      .pipe(
        map(([id, fundingTypeRefs]): FundingTypeRef => fundingTypeRefs.find(fundingTypeRef => fundingTypeRef.id == id)),
        filter((fundingTypeRef: FundingTypeRef) => fundingTypeRef !== undefined)
      )
      .subscribe((fundingTypeRef: FundingTypeRef) => this.fundingTypeRefS.fundingTypeRef.next(fundingTypeRef));

    this.fundingTypeRefS.stepper = this.stepper;
  }

  selected(fundingTypeRef: FundingTypeRef) {
    let url = this.id ? this.router.url.replace(this.id, fundingTypeRef.id.toString()) : `${this.router.url}/${fundingTypeRef.id.toString()}`;
    this.router.navigateByUrl(url);
  }

  create() {
    this.fundingTypeRefS.fundingTypeRef.next(null);
    this.fundingTypeRefS.moveStepper(1);
  }

  edit() {
    this.fundingTypeRefS.moveStepper(1);
  }

  ngOnDestroy() {
    this.fundingTypeRefS.fundingTypeRef.next(null);
  }

}
