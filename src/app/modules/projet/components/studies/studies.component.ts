import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { StudiesRepository } from '../../repository/studies.repository';
import { Study } from '../../repository/project.interface';
import { StudyFormDialog } from './study/form/study-form.dialog';

@Component({
  selector: 'app-projet-studies',
  templateUrl: './studies.component.html',
  styleUrls: ['./studies.component.scss']
})
export class StudiesComponent implements OnInit {

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns: string[] = ['code', 'label', 'dateStart', 'dateEnd', 'clos'];
  public filterInput: FormControl;
  public totalItems: number = 0;
  public loading: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private studiesR: StudiesRepository,
  ) { }

  ngOnInit() {
    this.filterInput = new FormControl('', []);

    combineLatest(
      this.getStudies(), 
      this.filterInput.valueChanges
        .pipe(
          startWith(''),
          debounceTime(300), 
          distinctUntilChanged(),
        )
    )
    .pipe(
      map(([dataSource, filteredValue]: [Study[], string]): Study[] => {
        return dataSource.filter(study => study.label.toLowerCase().includes(filteredValue.toLowerCase()));
      })
    )
    .subscribe((datasource: Study[]) => {
      this.dataSource.data = datasource;
      this.dataSource.sort = this.sort;
    });
  }

  getStudies(): Observable<Study[]> {
    this.loading = true;
    return this.studiesR.studies()
      .pipe(
        tap(()=>this.loading = false),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Study[]=>data["hydra:member"])
      );
  }

  createStudy() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(StudyFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((study: Study) => study !== null)
      )
      .subscribe((study) => this.router.navigate(['studies', study.id]));
  }
}
