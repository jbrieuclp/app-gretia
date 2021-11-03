import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { MatDialog } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { Localisation } from '../../../../repository/project.interface';
import { LocalisationService } from './localisation.service';

@Component({
  selector: 'app-projet-admin-localisations',
  templateUrl: './localisations.component.html',
  styleUrls: ['../../../css/list-display.scss']
})
export class LocalisationsComponent implements OnInit {

	get localisations(): Localisation[] { return this.localisationS.localisations; }
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  get localisation() { return this.localisationS.localisationSelect.getValue(); }

  constructor(
  	private localisationS: LocalisationService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.localisationS.stepper = this.stepper;
  }

  select(localisation: Localisation) {
    this.localisationS.moveStepper(0);
    this.localisationS.localisationSelect.next(localisation);
  }

  addLocalisation() {
    this.localisationS.localisationSelect.next(null);
    this.localisationS.moveStepper(1);
  }
}
