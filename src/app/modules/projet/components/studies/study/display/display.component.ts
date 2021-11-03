import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import { StudyService } from '../study.service';
import { StudyFormDialog } from '../form/study-form.dialog';

@Component({
  selector: 'app-projet-study-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class StudyDisplayComponent {

	get study() {
		return this.studyS.study.getValue();
	}

  get loading(): boolean {
    return this.studyS.loadingStudy;
  }

  constructor(
  	private studyS: StudyService,
    public dialog: MatDialog,
  ) { }

  openFormDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    // dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(StudyFormDialog, dialogConfig);

    // dialogRef.afterClosed()
    //   .pipe(
    //     filter((res: boolean) => res)
    //   )
    //   .subscribe((val) => this.studyS.refreshCharges());
  }
}
