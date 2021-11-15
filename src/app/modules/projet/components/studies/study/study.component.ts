import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription, Observable } from 'rxjs';
import { filter, map, tap, distinctUntilChanged } from 'rxjs/operators';

import { StudyService } from './study.service';
import { Study } from '../../../repository/project.interface';

@Component({
  selector: 'app-projet-study',
  templateUrl: './study.component.html',
  styleUrls: ['./study.component.scss']
})
export class StudyComponent implements OnInit, OnDestroy {

  tabs: any[] = [
    {url: "details", label: "Détails"}, 
    {url: "actions", label: "Actions"},
    {url: "charges", label: "Matériels & frais"}, 
    {url: "deadlines", label: "Échéances"}, 
    {url: "financements", label: "Financements"}, 
    {url: "bilan", label: "Bilan"}, 
  ];
  private _subscriptions: Subscription[] = [];
  get routeParams(): Observable <any> { return this.route.params; };

  get study(): Study { return this.studyS.study.getValue(); };
  get loading(): boolean { return this.studyS.loadingStudy; };

  constructor(
  	private route: ActivatedRoute,
    private location: Location,
    private studyS: StudyService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this.route.params
        .pipe(
          filter((params) => params.study),
          map((params): number => params.study),
          distinctUntilChanged(),
        )
        .subscribe((id) => this.studyS.study_id.next(Number(id)))
    );
  }

  ngOnDestroy() {
    this.studyS.study.next(null);
  }
}
