import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { map, tap, filter, switchMap, distinctUntilChanged } from 'rxjs/operators';

import { ProjectsRepository } from '../../../repository/projects.repository';
import { Project } from '../../../repository/project.interface';
import { ProjectService } from './project.service';
import { ProjectStudiesFundingsService } from './studies-fundings/studies-fundings.service';
import { ProjectFundersService } from './funders/funders.service';
import { ProjectSignatoriesService } from './signatories/signatories.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnDestroy {

  tabs: any[] = [
    {url: "details", label: "Détails", loader: function() {return this.projectS.loadingProject;}.bind(this)}, 
    {url: "etudes", label: "Devis (Études financées)", loader: function() {return this.projectStudiesFundingsS.loading;}.bind(this)},
    {url: "financeurs", label: "Financeurs", loader: function() {return this.projectFundersS.loading;}.bind(this)}, 
    {url: "signataires", label: "Signataires", loader: function() {return this.projectSignatoriesS.loading;}.bind(this)}, 
    {url: "echeances", label: "Échéances", loader: function() {return false;}},
    {url: "versements", label: "Versements", loader: function() {return false;}},
  ];
  private _subscriptions: Subscription[] = [];
  get routeParams(): Observable <any> { return this.route.params; };

  get project(): Project { return this.projectS.project.getValue(); }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private projectS: ProjectService,
    private projectStudiesFundingsS: ProjectStudiesFundingsService,
    private projectFundersS: ProjectFundersService,
    private projectSignatoriesS: ProjectSignatoriesService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this.route.params
        .pipe(
          filter((params) => params.project),
          map((params): number => params.project),
          distinctUntilChanged(),
        )
        .subscribe((id) => this.projectS.project_id.next(Number(id)))
    );

    this._subscriptions.push(
      this.route.params
        .pipe(
          filter((params) => params.onglet && params.project),
        )
        .subscribe((params) => this.location.go(`/projet/projets/${params.project}/${params.onglet}`))
    );
  }

  ngOnDestroy() {
    this.projectS.project_id.next(null);
    this.projectS.project.next(null);
  }

	// get project(): Project {
	// 	return this.projectS.project.getValue();
	// }
	// public form: FormGroup;
 //  get loading(): boolean { return this.projectS.loading; }
 //  get displayForm(): boolean { return this.projectS.displayForm; }
 //  selectedIndex: BehaviorSubject<number> = new BehaviorSubject(0);

 //  onglets: string[] = ["details", "funders", "signatories", "etudes", "echeances", "versements"];
 //  private _subscriptions: Subscription[] = [];

 //  constructor(
 //  	private route: ActivatedRoute,
 //    private location: Location,
 //  	private projectR: ProjectsRepository,
 //  	private projectS: ProjectService,
 // 	) { }

 //  ngOnInit() {

 //    this._subscriptions.push(
 //    	this.route.params.pipe(
 //        switchMap((params: any): Observable<Project> => params.project ? this.getProject(params.project) : of(null)),
 //      )
 //      .subscribe((project: Project) => this.projectS.project.next(project))
 //    );

 //    this._subscriptions.push(
 //      combineLatest(
 //        this.route.params,
 //        this.projectS.project.asObservable()
 //      )  
 //        .pipe(
 //          filter(([params, project]) => params.onglet !== undefined && project !== null),
 //          map(([params, project]) => params),
 //          map((params: any): number => this.onglets.findIndex(o => o === params.onglet)),
 //        )
 //        .subscribe((index: number) => this.selectedIndex.next(index))
 //    );

 //    this._subscriptions.push(
 //      this.selectedIndex.asObservable()
 //        .pipe(
 //          filter(() => this.project !== null),
 //          map((index: number): [number, string] => [this.project.id, this.onglets[index]]),
 //        )
 //        .subscribe(([id, onglet]) => this.location.go(`/projet/projets/${id}/${onglet}`))
 //    );

 //    this.form = this.projectS.form;
 //  }

 //  getProject(id): Observable<Project> {
 //  	this.projectS.loading = true;
 //  	return this.projectR.project(id)
 //  		.pipe(
 //  			tap(() => this.projectS.loading = false)
 //  		)
 //  }

 //  save() {
 //    this.projectS.submit();
 //  }

 //  edit() {
 //  	this.projectS.displayForm = true;
 //  }

 //  cancel() {
 //    this.projectS.displayForm = false;
 //    this.form.reset();
 //  }

 //  ngOnDestroy() {
 //    this._subscriptions.forEach(s => { s.unsubscribe(); });
 //  }
}
