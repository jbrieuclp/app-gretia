import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';

import { SuiveuseService } from '../suiveuse.service';
import { TravelFormService } from './travel-form/travel-form.service';
import { TravelFormDialog } from './travel-form/travel-form.dialog';
import { Travel } from '../../../repository/project.interface';
import { ApiProjectRepository } from '../../../repository/api-project.repository';
import { ConfirmationDialogComponent } from '../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GlobalsService } from '../../../../../shared/services/globals.service';

@Component({
  selector: 'app-project-worktime-travels',
  templateUrl: './travels.component.html',
  styleUrls: ['./travels.component.scss']
})
export class TravelsComponent implements OnInit {

  _travels: Travel[] = [];
  @Input() set travels(value){ this._travels = value };
  get travels(){ return this._travels.sort((a, b) => 
                              (this.orderBy.field !== 'travelDate' ? (a.travelDate > b.travelDate) : (a.study.label > b.study.label)) 
                                  ? 1 : -1) };
  @Input() orderBy: any;

  constructor(
    private suiveuseS: SuiveuseService,
    private travelFormS: TravelFormService,
    public dialog: MatDialog,
    public apiR: ApiProjectRepository,
    private globalS: GlobalsService,
  ) { }

  ngOnInit() {
  }

  edit(travel) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      travel: travel,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(TravelFormDialog, dialogConfig);
  }

  delete(travel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression du déplacement ${travel.travel} pour ${travel.study.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.apiR.delete(travel['@id'])
          .pipe(
            // tap(() => this.travelsS.refreshWorks(this.selectedDate.getValue())),
            // tap(() => this.suiveuseS.refreshDayData(work.workingDate)),
          )
          .subscribe(() => this.globalS.snackBar({msg: "Déplacement supprimé"}));
      }
    }); 
  }

  displayDuration(duration: number): string {
    const hour = Math.floor(duration/60);
    const minute = (duration % 60) < 10 ? `0${duration % 60}` : duration % 60;
    return `${hour}h${minute}`;
  }
}
