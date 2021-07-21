import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared';
import { RefProjectTypeService } from '../ref-project-type.service';
import { ProjectTypeService } from './project-type.service';
import { ProjectTypeRepository, RefProjectType } from '../../../../../repository/project-type.repository';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-admin-ref-project-type',
  templateUrl: './ref-project-type.component.html',
  styles: ['table .mat-icon-button { height: 24px; line-height: 24px; }']
})
export class RefProjectTypeComponent implements OnInit, AfterViewChecked {

  private _subscriptions: Subscription[] = [];
	public refProjectType: RefProjectType = null;
	public loading: boolean = false;
  public displayForm: boolean = false;

  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  constructor(
    private refProjectTypeS: RefProjectTypeService,
    private projectTypeR: ProjectTypeRepository,
    private projectTypeS: ProjectTypeService,
    private globalsS: GlobalsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.refProjectTypeS.refProjectType.asObservable()
        .pipe(
          distinctUntilChanged(),
          tap(() => {
            this.refProjectType = null;
            this.displayForm = false;
          }),
          filter((refProjectType: RefProjectType) => refProjectType !== null),
          switchMap((refProjectType: RefProjectType) => this.getRefProjectType(refProjectType))
        )
        .subscribe((refProjectType: RefProjectType) => this.refProjectType = refProjectType)
    );

  }

  ngAfterViewChecked() {
    if (this.stepper !== undefined) {
      this.projectTypeS.stepper = this.stepper;
    }
  }

  getRefProjectType(refProjectType): Observable<RefProjectType> {
  	this.loading = true;
  	return this.projectTypeR.get(refProjectType['@id'])
  		.pipe(
  			tap(() => this.loading = false)
  		);
  }

  delete(refProjectType: RefProjectType) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de ${refProjectType.libelle} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.refProjectTypeS.delete(refProjectType);
      }
    }); 
  }

  refreshRefProjectType() {
    this.getRefProjectType(this.refProjectType)
      .subscribe((refProjectType: RefProjectType) => this.refProjectType = refProjectType);
  }

  addProjectType() {
    this.projectTypeS.projectType.next(null);
    this.projectTypeS.moveStepper(1);
  }

  editRow(projectType) {
    this.projectTypeS.projectType.next(projectType);
    this.projectTypeS.moveStepper(1);
  }

  deleteRow(projectType) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.projectTypeR.delete(projectType['@id'])
          .pipe(
            tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"}))
          )
          .subscribe(() => this.refreshRefProjectType());
      }
    });
  }

}
