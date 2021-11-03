import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../shared';
import { ProjectsRepository } from '../../../../repository/projects.repository';
import { Project, Signatory } from '../../../../repository/project.interface';
import { ProjectSignatoriesService } from './signatories.service';
import { ProjectService } from '../project.service';
import { SignatoryFormDialog } from './signatory-form/signatory-form.dialog';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-project-signatories',
  templateUrl: './signatories.component.html',
  styleUrls: ['../table.scss']
})
export class SignatoriesComponent {

  get signatories() { return this.projectSignatoriesS.signatories; }
  get loading() { return this.projectSignatoriesS.loading; }

  constructor(
    public dialog: MatDialog,
    private projectR: ProjectsRepository,
    private globalsS: GlobalsService,
    private projectSignatoriesS: ProjectSignatoriesService,
    private projectS: ProjectService,
  ) { }

  openSignatoryFormDialog(signatory = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      'signatory': signatory,
    };
    dialogConfig.width = '450px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(SignatoryFormDialog, dialogConfig);

    dialogRef.afterClosed()
      // .subscribe((study) => this.router.navigate(['studies', study.id]));
      .subscribe(() => {return;});
  }

  delete(signatory) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.projectR.delete(signatory['@id'])
          .pipe(
            tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"})),
            switchMap(() => this.projectSignatoriesS.getSignatories(this.projectS.project.getValue()['id'])),
          )
          .subscribe(() => {return;});
      }
    });
  }

}
