import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { FonctionService } from '../fonction.service';
import { SalarieRepository, Fonction } from '../../../../../repository/salarie.repository';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-admin-fonction',
  templateUrl: './fonction.component.html'
})
export class FonctionComponent implements OnInit {
	
	private _subscriptions: Subscription[] = [];
	public fonction: Fonction = null;
	public loading: boolean = false;

  constructor(
    private fonctionS: FonctionService,
    private salarieR: SalarieRepository,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.fonctionS.fonction.asObservable()
        .pipe(
        	distinctUntilChanged(),
        	tap(() => this.fonction = null),
        	filter((fonction: Fonction) => fonction !== null),
        	switchMap((fonction: Fonction) => this.getFonction(fonction))
        )
        .subscribe((fonction: Fonction) => this.fonction = fonction)
    );

  }

  getFonction(fonction): Observable<Fonction> {
  	this.loading = true;
  	return this.salarieR.get(fonction['@id'])
  		.pipe(
  			tap(() => this.loading = false)
  		);
  }

  delete(fonction: Fonction) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la fonction ${fonction.label} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.fonctionS.delete(fonction);
      }
    }); 
  }

}
