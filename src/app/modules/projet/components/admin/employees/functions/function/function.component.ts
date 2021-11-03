import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { switchMap, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';

import { FunctionService } from '../function.service';
import { EmployeeRepository } from '../../../../../repository/employee.repository';
import { Function } from '../../../../../repository/project.interface';
import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-admin-function',
  templateUrl: './function.component.html'
})
export class FunctionComponent implements OnInit {
	
	private _subscriptions: Subscription[] = [];
	public eFunction: Function = null;
	public loading: boolean = false;

  constructor(
    private functionS: FunctionService,
    private employeeR: EmployeeRepository,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {

  	/**
    * Permet de passer une date dans l'URL
    * La vérification que le parametre date est bien une Date est effectué
    **/
    this._subscriptions.push(
      this.functionS.eFunction.asObservable()
        .pipe(
        	distinctUntilChanged(),
        	tap(() => this.eFunction = null),
        	filter((eFunction: Function) => eFunction !== null),
        	switchMap((eFunction: Function) => this.getFunction(eFunction))
        )
        .subscribe((eFunction: Function) => this.eFunction = eFunction)
    );

  }

  getFunction(eFunction): Observable<Function> {
  	this.loading = true;
  	return this.employeeR.get(eFunction['@id'])
  		.pipe(
  			tap(() => this.loading = false)
  		);
  }

  delete(eFunction: Function) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la eFunction ${eFunction.label} ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.functionS.delete(eFunction);
      }
    }); 
  }

}
