import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import { StudyService } from '../../study.service';

@Component({
  selector: 'app-projet-study-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class StudyInfoComponent {

	get study() {
		return this.studyS.study.getValue();
	}

  constructor(
  	private studyS: StudyService,
  ) { }
}
