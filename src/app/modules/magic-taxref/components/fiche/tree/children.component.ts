import { Component, Injectable, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { map } from 'rxjs/operators';

import { TaxrefRepository } from '../../../models/repositories';
import { Taxref13 } from '../../../models/taxref13.model';
import { Taxon } from '../../../models/taxon.model';
import { TreeService } from './tree.service';

@Component({
  selector: 'app-magictaxref-fiche-tree-children',
  templateUrl: './children.component.html',
  styleUrls: ['./children.component.css']
})
export class TreeChildrenComponent {

	@Input()
	taxon: Taxref13;

  @Input()
  indent: number;

  @Input()
  index: number;

  constructor(
    private taxrefR: TaxrefRepository,
    private treeS: TreeService,
  ) { }

  getChildrens(cd_ref: number) {
    if ( typeof(cd_ref) === 'undefined' )
      return;

    this.taxrefR.getChildrens(cd_ref)
      .pipe(
        map((data: any): any[]=>data["hydra:member"])
      )
      .subscribe( (childrens: any) => {
        this.treeS.setChildrens(cd_ref, childrens);
      });
  }

}
