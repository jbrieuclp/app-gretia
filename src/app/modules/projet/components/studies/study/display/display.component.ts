import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { StudyService } from '../study.service';
import { Study } from '@projet/repository/project.interface';

@Component({
  selector: 'app-projet-study-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.scss']
})
export class StudyDisplayComponent implements OnInit, OnDestroy {

  tabs: any[] = [
    {url: "details", label: "Détails"}, 
    {url: "actions", label: "Actions"},
    {url: "charges", label: "Matériels & frais"}, 
    {url: "deadlines", label: "Échéances"}, 
    {url: "financements", label: "Financements"}, 
    {url: "bilan", label: "Bilan"}, 
  ];
  private _subscriptions: Subscription[] = [];

  currentTab: string;
  get study(): Study { return this.studyS.study.getValue(); };
  get loading(): boolean { return this.studyS.loadingStudy; };

  constructor(
    private studyS: StudyService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this.studyS.currentTab.asObservable()
        .subscribe(tab => this.currentTab = tab)
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(sub => {sub.unsubscribe();});
  }
}
