import { Component, Injectable, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { TaxrefRepository } from '../../../models/repositories';
import { Taxref13 } from '../../../models/taxref13.model';
import { TreeService } from './tree.service';
import { FicheService } from '../fiche.service';

@Component({
  selector: 'app-magictaxref-fiche-tree',
  templateUrl: './tree.component.html'
})
export class TreeComponent implements OnInit {


  get parents(): any { return this.treeS.tree; }
  get depth(): any { return this.treeS.depth; }

  separator: string = '-';
  get indentation(): number { 
    return 25/this.treeS.depth; }

  constructor(
    private taxrefR: TaxrefRepository,
    private treeS: TreeService,
    private ficheS: FicheService,
  ) { }

  ngOnInit() {
    this.ficheS.cdRef
      .pipe(
        switchMap(cdRef => this.getTree(cdRef))
      )
      .subscribe(tree => this.treeS.tree = tree);
  }

  getTree(cd_ref: number): Observable<any> {
    return this.taxrefR.getParents(cd_ref)
      .pipe(
        tap(() => this.treeS.tree = {})
      );
  }
}
