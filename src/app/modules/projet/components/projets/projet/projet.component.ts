import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';
import { filter, map, tap, distinctUntilChanged } from 'rxjs/operators';

import { ProjetService } from './projet.service';

@Component({
  selector: 'app-projet-projet',
  templateUrl: './projet.component.html',
  styleUrls: ['./projet.component.scss']
})
export class ProjetComponent implements OnInit, OnDestroy {

  tabs: any[] = [{url: "details", label: "Détails"}, {url: "montage", label: "Montage"}, {url: "financement", label: "Financement"}, {url: "taches", label: "Tâches"}];
  private _subscriptions: Subscription[] = [];

  constructor(
  	private route: ActivatedRoute,
    private location: Location,
    private projetS: ProjetService,
  ) { }

  ngOnInit() {
    this._subscriptions.push(
      this.route.params
        .pipe(
          filter((params) => params.projet),
          map((params): number => params.projet),
          distinctUntilChanged(),
        )
        .subscribe((id) => this.projetS.project_id.next(Number(id)))
    );

    this._subscriptions.push(
      this.route.params
        .pipe(
          filter((params) => params.onglet && params.projet),
        )
        .subscribe((params) => this.location.go(`/projet/projets/${params.projet}/${params.onglet}`))
    );
  }

  ngOnDestroy() {
    this.projetS.projet.next(null);
  }
}
