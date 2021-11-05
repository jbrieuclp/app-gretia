import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { GlobalsService } from '../../../../../shared/services/globals.service';
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
  //liste des work à afficher : enlève celui en cours de modification si c'est le cas
  get works(): Work[] { return this.workS.works.filter(elem => elem !== this.workFormS.work.getValue()); }
  get loading(): boolean { return this.workS.loading; }

  constructor(
  	private suiveuseS: SuiveuseService,
    private workS: WorkService,
    public dialog: MatDialog,
    private suiveuseR: SuiveuseRepository,
    private workFormS: WorkFormService,
    private globalS: GlobalsService,
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
    console.log(work);
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de ${work.duration}h de ${work.action.category.label} pour ${work.action.study.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.suiveuseR.delete(work['@id'])
          .pipe(
            tap(() => this.workS.refreshWorks(this.selectedDate.getValue())),
            tap(() => this.suiveuseS.refreshDayData(work.workingDate)),
          )
          .subscribe(() => this.globalS.snackBar({msg: "Travail supprimée"}));
      }
    }); 
  }

}
