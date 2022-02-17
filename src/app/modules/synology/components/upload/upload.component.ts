import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef  } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Subscription, BehaviorSubject, Observable } from 'rxjs';
import { finalize, filter, distinctUntilChanged, tap } from 'rxjs/operators';
import * as uuid from 'uuid';

import { SynologyRepository } from '@synology/synology.repository';

interface FILE_STATE {
  file: {
    uuid: string;
    name: string;
    complete_path: string;
    prefixedName: string;
  }, 
  state: null|'select'|'uploading'|'deleting'|'done'|'canceled';
  previousState: null|'select'|'uploading'|'deleting'|'done'|'canceled';
};

@Component({
  selector: 'app-synology-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  uuid: string = uuid.v4();
  _fileName: string = '';
  set fileName(value) { this._fileName = value; };
  get fileName() { return this._fileName; };
  get prefixedFileName() { return `${this.fileNamePrefix}${this._fileName}`; };
  get complete_path() {
    return this.fileName !== '' ? `${this.folder}/${this.prefixedFileName}` : null;
  }
  uploadProgress:number;
  uploadSub: Subscription;
  $uploadRequest: Observable<any>;
  done: boolean = false;
  isDeletable: boolean = false;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;

  _previousFileState: null|'select'|'uploading'|'deleting'|'done'|'canceled' = null;
  _fileState: null|'select'|'uploading'|'deleting'|'done'|'canceled' = null;
  set fileState(value: 'select'|'uploading'|'deleting'|'done'|'canceled') { 
    this._previousFileState = this.fileInfo.state; 
    this._fileState = value; 
  }
  get fileState() { return this._fileState; };
  get fileInfo() { 
    return {
      file: {
        uuid: this.uuid,
        name: this.fileName,
        complete_path: this.complete_path,
        prefixedName: this.prefixedFileName,
      },
      state: this.fileState,
      previousState: this._previousFileState,
    }
  }

  @ViewChild(MatRipple, {static: false}) ripple: MatRipple;

  @Input() folder: string = null
  @Input() fileNamePrefix: string = ''
  @Input() savingType: 'onSelect' | 'onSubmit' = 'onSelect';
  private _submit: BehaviorSubject<boolean> = new BehaviorSubject(false);
  @Input() set submit(value: boolean) { this._submit.next(value); };
  //fire when operation is in load (upload or delete file) => return true or false
  @Output() onStateChange = new EventEmitter<FILE_STATE>();

  constructor(
    private synologyR: SynologyRepository,
  ) { }

  ngOnInit() {
    if (this.savingType === 'onSubmit') {
      this._submit.asObservable()
        .pipe(
          distinctUntilChanged(),
          filter(val => val === true),
          filter(() => this.$uploadRequest !== undefined),
        )
        .subscribe(() => this.saving());

    }

  }


  onFileSelected(event) {
    const file:File = event.target.files[0];
  
    if (file) {
      this.fileName = file.name;

      this.fileState = 'select';
      this.onStateChange.emit(this.fileInfo);

      this.$uploadRequest = this.synologyR.upload(file, this.prefixedFileName, {
        path: this.folder,
        overwrite: 'true',
        create_parents: 'true'
      })
      .pipe(
        // catchError(error => of(`Bad Promise: ${error}`)),
        finalize(() => {
          this.uploadProgress = null;
          this.uploadSub = null;
        })
      );

      console.log(this.$uploadRequest);

      if (this.savingType === 'onSelect') {
        this.saving();
      }
    }
  }

  private saving() {
      console.log(this.$uploadRequest);
    this.fileState = 'uploading';
    this.onStateChange.emit(this.fileInfo);

    this.uploadSub = this.$uploadRequest.subscribe(
      event => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      },
      err => {return;},
      () => this.doneAction()
    )
  }
  
  doneAction() {
    setTimeout(() => {
      const rippleRef = this.ripple.launch({
        persistent: true,
        centered: true,
        radius: 40,
        color: '#92ef92',
        animation: {exitDuration: 800},
      });
      rippleRef.fadeOut();
    }, 100);
    this.fileState = 'done';
    this.onStateChange.emit(this.fileInfo);

    if (this.savingType === 'onSelect') {
      setTimeout(() => { this.isDeletable = true; }, 1000);
    }
  }

  cancelUpload() {
    if (this.fileInfo.state === 'uploading' && this.savingType === 'onSubmit') { return; }

    this.uploadSub.unsubscribe();
    this.fileState = 'canceled';
    this.onStateChange.emit(this.fileInfo);
    this.reset(false);
  }

  reset(emit = true) {
    this.fileName = '';
    this.isDeletable = false
    this.uploadProgress = null;
    this.uploadSub = null;
    this.fileInput.nativeElement.value = null;
    if (emit) {
      this.fileState = null;
      this.onStateChange.emit(this.fileInfo);
    }
  }

  deleteFile() {
    if (this.complete_path === null || this.savingType === 'onSubmit') { return; }
    
    this.fileState = 'deleting';
    this.onStateChange.emit(this.fileInfo);
    this.synologyR.delete(this.complete_path)
      .pipe(
        filter(res => res.success)
      )
      .subscribe(() => this.reset());
  }

}
