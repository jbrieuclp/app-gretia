import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { AntenneService } from '../antenne.service';
import { SalarieRepository, Antenne } from '../../../../../repository/salarie.repository';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-project-admin-antenne',
  templateUrl: './antenne.component.html'
})
export class AntenneComponent implements OnInit {

	private _subscriptions: Subscription[] = [];
	public antenne: Antenne = null;
	public loading: boolean = false;

  constructor(
    private antenneS: AntenneService,
    private salarieR: SalarieRepository,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.antenneS.antenne.asObservable()
        .pipe(
        	distinctUntilChanged(),
        	tap(() => this.antenne = null),
        	filter((antenne: Antenne) => antenne !== null),
        	switchMap((antenne: Antenne) => this.getAntenne(antenne))
        )
        .subscribe((antenne: Antenne) => this.antenne = antenne)
    );

  }

  getAntenne(antenne): Observable<Antenne> {
  	this.loading = true;
  	return this.salarieR.get(antenne['@id'])
  		.pipe(
  			tap(() => this.loading = false)
  		);
  }

  delete(antenne: Antenne) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de l'antenne ${antenne.nom} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.antenneS.delete(antenne);
      }
    }); 
  }

}
