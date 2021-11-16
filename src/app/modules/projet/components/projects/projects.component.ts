import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, tap, filter, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { GlobalProjectService } from '../global-project.service';
import { ProjectsRepository } from '../../repository/projects.repository';
import { Project, Study } from '../../repository/project.interface';
import { ProjectFormDialog } from './project/project-form/project-form.dialog';
import { StudyFormDialog } from '../studies/study/form/study-form.dialog';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProjectsComponent implements OnInit {

	get projects(): Project[] { return this.globalProjectS.projects.getValue(); }
	public totalItems: number = 0;
  
  get loadingList(): boolean { return this.globalProjectS.loadingList; }

  expandedElement: Project | null;
  columnsToDisplay: any[] = ['access', 'projectType', 'label', 'localAttachment', 'dateStart', 'dateEnd'];

  public filterInput: FormControl;
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialog: MatDialog,
    public location: Location,
    private router: Router,
    private route: ActivatedRoute,
  	private projectsR: ProjectsRepository,
    private globalProjectS: GlobalProjectService,
  ) { }

  ngOnInit() {
    this.filterInput = new FormControl('', []);

    combineLatest(
      this.route.queryParams
        .pipe(
          filter(params => params['project'] !== undefined),
          map((params: any): number => Number(params['project'])),
        ),
      this.globalProjectS.projects.asObservable()
        .pipe(
          filter((val) => val !== null)
        )
    ) 
    .pipe(
      map(([project_id, projects]: [number, Project[]]): Project => projects.find(elem => elem.id === project_id))
    )
    .subscribe((project: Project) => this.expandedElement = project)

    combineLatest(
      this.globalProjectS.projects.asObservable()
        .pipe(
          filter((val) => val !== null)
        ),
      this.filterInput.valueChanges
        .pipe(
          startWith(''),
          debounceTime(300), 
          distinctUntilChanged(),
        )
    )
    .pipe(
      map(([projects, filteredValue]: [Project[], string]): Project[] => {
        return projects.filter(project => project.label.toLowerCase().includes(filteredValue.toLowerCase()));
      })
    )
    .subscribe((projects: Project[]) => {
      this.dataSource.data = projects;
      this.dataSource.sort = this.sort;
    });
  }

  selectProject(project) {
    this.expandedElement = this.expandedElement === project ? null : project;
    if (this.expandedElement !== null) {
      this.location.go(`${this.router.url.split('?')[0]}?project=${project.id}`);
    } else {
      this.location.go(this.router.url.split('?')[0]);
    }
  }

  openProjectFormDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {
      'project': null,
    };
    dialogConfig.width = '750px';
    dialogConfig.position = {top: '70px'};
    dialogConfig.disableClose = true;

    const dialogRef = this.dialog.open(ProjectFormDialog, dialogConfig);

    dialogRef.afterClosed()
      .pipe(
        filter((project: Project) => {console.log(project); return false;}),
        map((project: Project): number => project.id)
      )
      .subscribe((id: number) => this.location.replaceState(`/projet/projets/${id}`));
  }

  openStudyFormDialog() {
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
