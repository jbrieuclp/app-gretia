import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from "@angular/forms";
import { tap } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

import { Localisation } from '../../../../repository/project.interface';
import { LocalisationService } from './localisation.service';

@Component({
  selector: 'app-projet-admin-localisation-info',
  templateUrl: './info.component.html',
  styleUrls: ['../../../css/info.scss']
})
export class LocalisationInfoComponent implements OnInit {

  public localisation: Localisation;

  constructor(
  	public dialog: MatDialog,
  	private localisationS: LocalisationService,
  	private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  	this.localisationS.localisationSelect.asObservable()
  		.subscribe(localisation=>this.localisation = localisation);
  }

  edit(localisation: Localisation) {
    this.localisationS.localisationSelect.next(localisation);
    this.localisationS.moveStepper(1);
  }

  delete(localisation: Localisation) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la localisation "${localisation.name}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.localisationS.delete(localisation);
      }
    }); 
  }
}
