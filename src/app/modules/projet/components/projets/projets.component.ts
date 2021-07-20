import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, combineLatest, BehaviorSubject } from 'rxjs';
import { tap, map, startWith, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { ProjetRepository, Projet } from '../../repository/projet.repository';
import { ProjetFormDialog } from './projet/form/projet-form.dialog';

@Component({
  selector: 'app-projet-admin-projets',
  templateUrl: './projets.component.html',
  styleUrls: ['./projets.component.scss']
})
export class ProjetsComponent implements OnInit {

  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  public displayedColumns: string[] = ['code', 'intitule', 'dateDebut', 'dateFin', 'clos'];
  public filterInput: FormControl;
  public totalItems: number = 0;
  public loading: boolean = false;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private projetR: ProjetRepository,
  ) { }

  ngOnInit() {
    this.filterInput = new FormControl('', []);

    combineLatest(
      this.getProjets(), 
      this.filterInput.valueChanges
        .pipe(
          startWith(''),
          debounceTime(300), 
          distinctUntilChanged(),
        )
    )
    .pipe(
      map(([dataSource, filteredValue]: [Projet[], string]): Projet[] => {
        return dataSource.filter(projet => projet.intitule.toLowerCase().includes(filteredValue.toLowerCase()));
      })
    )
    .subscribe((datasource: Projet[]) => {
      this.dataSource.data = datasource;
      this.dataSource.sort = this.sort;
    });
  }

  getProjets(): Observable<Projet[]> {
    this.loading = true;
    return this.projetR.projets()
      .pipe(
        tap(()=>this.loading = false),
        tap((data: any) => this.totalItems = data["hydra:totalItems"]),
        map((data: any): Projet[]=>data["hydra:member"])
      );
  }

  createProject() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ProjetFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((projet: Projet) => projet !== null)
      )
      .subscribe((projet) => this.router.navigate(['projets', projet.id]));
  }
}
