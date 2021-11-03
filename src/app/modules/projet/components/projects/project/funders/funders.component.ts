import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';
import fr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

import { GlobalsService } from '../../../../../../shared';
import { ProjectsRepository } from '../../../../repository/projects.repository';
import { Project, Funder } from '../../../../repository/project.interface';
import { ProjectFundersService } from './funders.service';
import { ProjectService } from '../project.service';
import { FunderFormDialog } from './funder-form/funder-form.dialog';
import { DailyCostFormDialog } from './daily-cost-form/daily-cost-form.dialog';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-project-funders',
  templateUrl: './funders.component.html',
  styleUrls: ['../table.scss']
})
export class FundersComponent {

	get funders() { return this.projectFundersS.funders; }
  get loading() { return this.projectFundersS.loading; }
  get total(): number { return this.projectFundersS.total; }
  get project(): Project { return this.projectS.project.getValue(); }
  public dailyCostFormDisplay: boolean = false;
  public dailyCostForm: FormControl = new FormControl();

  constructor(
    public dialog: MatDialog,
    private projectR: ProjectsRepository,
    private globalsS: GlobalsService,
    private projectFundersS: ProjectFundersService,
    private projectS: ProjectService,
  ) { 
    registerLocaleData( fr );
  }

  openFunderFormDialog(funder = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      'funder': funder,
    };
    dialogConfig.width = '450px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(FunderFormDialog, dialogConfig);

    dialogRef.afterClosed()
      // .subscribe((study) => this.router.navigate(['studies', study.id]));
      .subscribe(() => {return;});
  }

  delete(funder) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.projectR.delete(funder['@id'])
          .pipe(
            tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"})),
            switchMap(() => this.projectFundersS.getFunders(this.projectS.project.getValue()['id'])),
          )
          .subscribe(() => {return;});
      }
    });
  }

  openDialyCostFormDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '450px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(DailyCostFormDialog, dialogConfig);

    dialogRef.afterClosed()
      // .subscribe((study) => this.router.navigate(['studies', study.id]));
      .subscribe(() => {return;});
  }
}
