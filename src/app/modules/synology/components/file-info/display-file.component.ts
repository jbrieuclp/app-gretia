import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { filter } from 'rxjs/operators';

import { SynologyRepository } from '@synology/synology.repository';

@Component({
  selector: 'app-synology-display-file',
  templateUrl: './display-file.component.html',
  styleUrls: ['./display-file.component.scss']
})
export class DisplayFileComponent implements OnInit {

  @Input() file: any;
  @Input() downloadable: boolean = true;
  @Input() deletable: boolean = true;
  @Input() removeOnSynogy: boolean = false;
  @Output() onDelete = new EventEmitter<string>();

  error: boolean;

  get fileName()  { return this.file.path.replace(/^.*[\\\/]/, ''); };
  get fileSize()  {
    if ((this.file.additional.size / Math.pow(2, 10)) < 100) {
      const size = this.file.additional.size;
      return `${size} o`;
    } else if ((this.file.additional.size / Math.pow(2, 20)) < 100) {
      const size = Math.round(this.file.additional.size / Math.pow(2, 20) * 100) / 100;
      return `${size} ko`;
    } else if ((this.file.additional.size / Math.pow(2, 30)) < 100) {
      const size = Math.round(this.file.additional.size / Math.pow(2, 30) * 100) / 100;
      return `${size} Mo`;
    } else if ((this.file.additional.size / Math.pow(2, 40)) < 100) {
      const size = Math.round(this.file.additional.size / Math.pow(2, 40) * 100) / 100;
      return `${size} Go`;
    } else if ((this.file.additional.size / Math.pow(2, 50)) < 100) {
      const size = Math.round(this.file.additional.size / Math.pow(2, 50) * 100) / 100;
      return `${size} To`;
    }

    return '-';
  };

  constructor(
    private synologyR: SynologyRepository,
  ) { }

  ngOnInit() {
    this.error = this.file.code == '408';
  }

  download() {
    this.synologyR.download(this.file.path)
      .subscribe((res: ArrayBuffer) => this.saveFile(res, this.file.name),)
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

  delete() {
    if (this.removeOnSynogy) {
      this.synologyR.delete(this.file.path)
        .pipe(
          filter(res => res.success)
        )
        .subscribe(() => this.onDelete.emit(this.file.path));
    } else {
      this.onDelete.emit(this.file.path)
    }
  }
}
