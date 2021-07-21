import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared';
import { PersonneService } from '../personne.service';
import { SalarieService } from './salarie.service';
import { SalarieRepository, Personne } from '../../../../../repository/salarie.repository';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-admin-personne',
  templateUrl: './personne.component.html',
  styles: ['table .mat-icon-button { height: 24px; line-height: 24px; }']
})
export class PersonneComponent implements OnInit, AfterViewChecked {

  private _subscriptions: Subscription[] = [];
	public personne: Personne = null;
	public loading: boolean = false;
  public displayForm: boolean = false;

  @ViewChild('stepper', { static: false }) private stepper: MatStepper;

  constructor(
    private personneS: PersonneService,
    private salarieR: SalarieRepository,
    private salarieS: SalarieService,
    private globalsS: GlobalsService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.personneS.personne.asObservable()
        .pipe(
          distinctUntilChanged(),
          tap(() => {
            this.personne = null;
            this.displayForm = false;
          }),
          filter((personne: Personne) => personne !== null),
          switchMap((personne: Personne) => this.getPersonne(personne))
        )
        .subscribe((personne: Personne) => this.personne = personne)
    );

  }

  ngAfterViewChecked() {
    if (this.stepper !== undefined) {
      this.salarieS.stepper = this.stepper;
    }
  }

  getPersonne(personne): Observable<Personne> {
  	this.loading = true;
  	return this.salarieR.get(personne['@id'])
  		.pipe(
  			tap(() => this.loading = false)
  		);
  }

  delete(personne: Personne) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de ${personne.prenom} ${personne.nom} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.personneS.delete(personne);
      }
    }); 
  }

  refreshPerson() {
    this.getPersonne(this.personne)
      .subscribe((personne: Personne) => this.personne = personne);
  }

  addSalarie() {
    this.salarieS.salarie.next(null);
    this.salarieS.moveStepper(1);
  }

  editContrat(salarie) {
    this.salarieS.salarie.next(salarie);
    this.salarieS.moveStepper(1);
  }

  deleteContrat(salarie) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.salarieR.delete(salarie['@id'])
          .pipe(
            tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"}))
          )
          .subscribe(() => this.refreshPerson());
      }
    });
  }

}
