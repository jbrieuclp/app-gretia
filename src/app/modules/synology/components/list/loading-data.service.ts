import { Injectable } from '@angular/core';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { filter, map, tap } from "rxjs/operators";

import { SynologyRepository } from '@synology/synology.repository';

interface FileNode {
  additional: any;
  isdir: boolean;
  name: string;
  path: string;
}

export class DynamicFlatNode {
  constructor(public item: FileNode, public level = 1, public expandable = false,
              public isLoading = false) {}
}


/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class DynamicDataSource {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private synologyR: SynologyRepository,
  ) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {

    this._treeControl.expansionModel.onChange.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  initData(folder) {
    this.list(folder)
      .pipe(
        map((files: FileNode[]): DynamicFlatNode[] => files.map((item) => new DynamicFlatNode(item, 0, item.isdir))),
      )
      .subscribe(data => this.data = data);
  }

  /** Handle expand/collapse behaviors */
  private handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  private toggleNode(node: DynamicFlatNode, expand: boolean) {

    node.isLoading = true;
    const index = this.data.indexOf(node);

    this.list(node.item.path)
      .pipe(
        tap(() => node.isLoading = false)
      )
      .subscribe(
        children => {
          if (expand) {
            const nodes = children.map(item => new DynamicFlatNode(item, node.level + 1, item.isdir));
            this.data.splice(index + 1, 0, ...nodes);
          } else {
            let count = 0;
            for (let i = index + 1; i < this.data.length
              && this.data[i].level > node.level; i++, count++) {}
            this.data.splice(index + 1, count);
          }

          // notify the change
          this.dataChange.next(this.data);
        }
      )
  }

  private list(folder): Observable<any> {
    return this.synologyR.list(folder)
      .pipe(
        filter((res) => res.success === true),
        map((res): FileNode[] => res.data.files),
      )
  }
}