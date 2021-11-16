import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { tap, filter } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { StudyDeadlinesService } from './deadlines.service';
import { StudyDeadline, Study } from '../../../../repository/project.interface';
import { ApiProjectRepository } from '../../../../repository/api-project.repository';
import { StudyDeadlineFormDialog } from './form/deadline-form.dialog';

@Component({
  selector: 'app-project-study-deadlines',
  templateUrl: './deadlines.component.html',
  styleUrls: ['./deadlines.component.scss']
})
export class StudyDeadlinesComponent implements OnInit {

  get deadlines(): StudyDeadline[] { return this.studyDeadlinesS.deadlines.getValue(); };
  get loading(): boolean { return this.studyDeadlinesS.loading; };

  constructor(
    private dialog: MatDialog,
    private studyDeadlinesS: StudyDeadlinesService,
    private apiR: ApiProjectRepository,
  ) { }

  ngOnInit() {
  }

  openDeadlineForm() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(StudyDeadlineFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((res: boolean) => res)
      )
      .subscribe((val) => {}/*this.projetS.refreshCharges()*/);
  }

  delete(deadline: StudyDeadline) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de "${deadline.deadlineType.label}" au "${deadline.date}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.apiR.delete(deadline['@id'])
          .pipe(
            tap(() => {
              const idx = this.deadlines.findIndex(e => e === deadline);
              if ( idx !== -1) {
                this.deadlines.splice(idx, 1);
              }
            }),
            // tap(() => this.projetS.snackBar("Tâche supprimée avec succès")),
          )
          .subscribe(() => {return;});
      }
    }); 
  }

}
