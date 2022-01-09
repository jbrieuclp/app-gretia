import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import * as moment from 'moment';

import { GlobalsService } from '@shared/services/globals.service';
import { SuiveuseService } from '../suiveuse.service';
import { WorksRepository } from '@projet/repository/works.repository';
import { Work } from '@projet/repository/project.interface';
import { WorkFormService } from './work-form/work-form.service';
import { SuiveuseRepository } from '@projet/repository/suiveuse.repository';
import { ConfirmationDialogComponent } from '@shared/components/confirmation-dialog/confirmation-dialog.component';
import { WorkFormDialog } from './work-form/work-form.dialog';

@Component({
  selector: 'app-projet-suiveuses-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit {

  _works: Work[] = [];
  @Input() set works(value){ this._works = value };
  get works(){ return this._works.sort((a, b) => 
                              (this.orderBy.field !== 'workingDate' ? (a.workingDate > b.workingDate) : (a.study.label > b.study.label)) 
                                  ? 1 : -1) };
  @Input() orderBy: any;

  constructor(
    public dialog: MatDialog,
    private suiveuseR: SuiveuseRepository,
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
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      work: work,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(WorkFormDialog, dialogConfig);
  }

  deleteWork(work) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de ${work.duration}h de ${work.action.category.label} pour ${work.action.study.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.suiveuseR.delete(work['@id'])
          .pipe(
            // tap(() => this.worksS.refreshWorks(this.selectedDate.getValue())),
            // tap(() => this.suiveuseS.refreshDayData(work.workingDate)),
          )
          .subscribe(() => this.globalS.snackBar({msg: "Travail supprimée"}));
      }
    }); 
  }

}
