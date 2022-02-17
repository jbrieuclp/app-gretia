import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { filter, map, tap } from 'rxjs/operators';

import { SynologyRepository } from '@synology/synology.repository';

@Component({
  selector: 'app-synology-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.scss']
})
export class FileInfoComponent implements OnInit {

  _path: string|string[] = null;
  @Input() set path(value: string|string[]) { this._path = value; };
  @Input() downloadable: boolean = true;
  @Input() deletable: boolean = true;
  @Input() removeOnSynogy: boolean = false;
  get path(): string|string[] { 
    if (Array.isArray(this._path)) {
      return `[${this._path.map(path => `"${path}"`).join(',')}]`;
    }
    return this._path;
  };
  files: any[] = [];

  @Output() onListChange = new EventEmitter<any>();


  constructor(
    private synologyR: SynologyRepository,
  ) { }

  ngOnInit() {
    this.synologyR.getFileInfo(this.path)
      .pipe(
        filter(res => res.success),
        tap(res => console.log(res)),
        map(res => res.data.files)
      )
      .subscribe(files => this.files = files);
  }

  deleteFileFromList(path) {
    if (Array.isArray(this._path)) {
      const idx = this._path.findIndex(e => e === path);
      if (idx !== -1) {
        this._path.splice(idx, 1);
      }
    } else if (this._path === path) {
      this._path = null;
    }

    const idx = this.files.findIndex(e => e.path === path);
    if (idx !== -1) {
      this.files.splice(idx, 1);
    }

    this.onListChange.emit(this._path);
  }

}
