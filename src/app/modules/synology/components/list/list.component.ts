import { Component, OnInit, Input } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';

import { DynamicDataSource, DynamicFlatNode } from './loading-data.service';
import { SynologyRepository } from '@synology/synology.repository';

@Component({
  selector: 'app-synology-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  @Input() folder: string = null;

  constructor(
    private synologyR: SynologyRepository,
  ) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this.synologyR);
  }

  ngOnInit() {
    this.dataSource.initData(this.folder);
  }

  getLevel = (node: DynamicFlatNode) => node.level;

  isExpandable = (node: DynamicFlatNode) => node.expandable;

  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;

  isEmpty = (_: number, _nodeData: DynamicFlatNode) => {console.log(_, _nodeData);return _nodeData.expandable};

  downloadFile(file) {
    this.synologyR.download(file.path)
      .subscribe((res: ArrayBuffer) => this.saveFile(res, file.name),)
  }

  private saveFile(blob, filename) {
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0)
  }

}

