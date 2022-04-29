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
  styleUrls: ['./study.component.scss'],
})
export class StudyComponent implements OnInit, OnDestroy {

  tabs: any[] = [
    {url: "form"}, 
    {url: "details", label: "Détails"}, 
    {url: "actions", label: "Actions"},
    {url: "charges", label: "Matériels & frais"}, 
    {url: "deadlines", label: "Échéances"}, 
    {url: "financements", label: "Financements"}, 
    {url: "bilan", label: "Bilan"}, 
  ];
  private _subscriptions: Subscription[] = [];
  displayForm: boolean = false;

  get study(): Study { return this.studyS.study.getValue(); };
  get loading(): boolean { return this.studyS.loadingStudy; };

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private studyS: StudyService,
  ) { }

  ngOnInit() {
    //recupération de l'ID study et de l'onglet affiché
    this._subscriptions.push(
      this.route.params
        .pipe(
          distinctUntilChanged(),
          map((params): any => {
            const elem = {};
            if (isNaN(Number(params.study))) {
              throw "404 - Not Found"
            }
            elem['study'] = Number(params.study);
            elem['tab'] = params.tab !== '' ? params.tab : null;
            return elem;
          })
        )
        .subscribe(
          (params) => {
            if (params.study !== this.studyS.study_id.value) {
              this.studyS.study_id.next(params.study);
            }

            if (params.tab !== this.studyS.currentTab.value) {
              this.studyS.currentTab.next(params.tab);
            }
          },
          (err) => console.log(err)
        )
    );

      //gère l'affichage du formulaire selon l'URL
    this._subscriptions.push(
      this.studyS.currentTab
        .pipe(
          map((tab: string): boolean => tab === 'form')
        )
        .subscribe(display => this.displayForm = display)
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {sub.unsubscribe();})
  }
}
