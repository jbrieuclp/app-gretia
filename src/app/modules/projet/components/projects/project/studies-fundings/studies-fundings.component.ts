import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { Observable, of, Subscription } from 'rxjs';
import { map, tap, filter, switchMap } from 'rxjs/operators';
import fr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';

import { GlobalsService } from '../../../../../../shared';
import { ProjectsRepository } from '../../../../repository/projects.repository';
import { Project, StudyFunding } from '../../../../repository/project.interface';
import { ProjectStudiesFundingsService } from './studies-fundings.service';
import { ProjectService } from '../project.service';
import { ProjectFundersService } from '../funders/funders.service';
import { StudyFundingFormDialog } from './study-funding-form/study-funding-form.dialog';
import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-project-studies-fundings',
  templateUrl: './studies-fundings.component.html',
  styleUrls: ['../table.scss']
})
export class StudiesFundingsComponent implements OnInit {

  get studiesFundings() { return this.projectStudiesFundingsS.studiesFundings; }
  get loading() { return this.projectStudiesFundingsS.loading; }
  get total(): number {
    return this.studiesFundings.map(e => e.eligibleFunding).reduce((a, b) => a+b, 0);
  }
  get totalfunding(): number { return this.projectFundersS.total; }
  showDetails: boolean = false;

  constructor(
    public dialog: MatDialog,
    private projectR: ProjectsRepository,
    private globalsS: GlobalsService,
    private projectStudiesFundingsS: ProjectStudiesFundingsService,
    private projectS: ProjectService,
    private projectFundersS: ProjectFundersService,
  ) { }

  ngOnInit() {
    registerLocaleData( fr );
  }

  openStudyFundingFormDialog(studyFunding = null) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      'studyFunding': studyFunding,
    };
    dialogConfig.width = '450px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(StudyFundingFormDialog, dialogConfig);

    dialogRef.afterClosed()
      // .subscribe((study) => this.router.navigate(['studies', study.id]));
      .subscribe(() => {return;});
  }

  delete(studyFunding) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de cette ligne ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.projectR.delete(studyFunding['@id'])
          .pipe(
            tap(() => this.globalsS.snackBar({msg: "Suppression effectuée"})),
            switchMap(() => this.projectStudiesFundingsS.getStudiesFundings(this.projectS.project.getValue()['id'])),
          )
          .subscribe(() => {return;});
      }
    });
  }
}
