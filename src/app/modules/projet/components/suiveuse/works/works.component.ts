import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { SuiveuseService } from '../suiveuse.service';
import { WorksRepository } from '../../../repository/works.repository';
import { Work } from '../../../repository/project.interface';
import { WorkService } from './work.service';
import { WorkFormService } from './work-form/work-form.service';
import { SuiveuseRepository } from '../../../repository/suiveuse.repository';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-projet-suiveuses-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {

	get selectedDate() { return this.suiveuseS.selectedDate; }
  get works(): Work[] { return this.workS.works; }
  get loading(): boolean { return this.workS.loading; }

  constructor(
  	private suiveuseS: SuiveuseService,
    private workS: WorkService,
    public dialog: MatDialog,
    private suiveuseR: SuiveuseRepository,
    private workFormS: WorkFormService,
  ) { }

  ngOnInit() {
  	
  }

  displayDuration(duration: number): string {
    const hour = Math.floor(duration/60);
    const minute = (duration % 60) < 10 ? `0${duration % 60}` : duration % 60;
    return `${hour}h${minute}`;
  }

  editWork(work) {
    this.workFormS.work.next(work);
  }

  deleteWork(work) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de ${work.duration}h de travail sur "${work.action.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.suiveuseR.delete(work['@id'])
          .pipe(
            // tap(() => this.projetS.snackBar("Tâche supprimée avec succès")),
          )
          .subscribe(() => this.workS.refreshWorks(this.selectedDate.getValue()));
      }
    }); 
  }

}
