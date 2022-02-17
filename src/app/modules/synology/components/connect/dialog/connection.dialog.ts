import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { SynologyService } from '@synology/synology.service';
@Component({
  selector: 'app-synology-connection-dialog',
  templateUrl: './connection.dialog.html',
})
export class SynoConnectionDialog implements OnInit, OnDestroy {

  private sub: Subscription;

  constructor(
    public dialogRef: MatDialogRef<SynoConnectionDialog>,
    @Inject(MAT_DIALOG_DATA) public message: string,
    private synologyS: SynologyService,
  ) { }

  ngOnInit() {
    this.sub = this.synologyS.$sid.asObservable()
      .pipe(
        filter(val => val !== null)
      )
      .subscribe(() => this.dialogRef.close(true));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
}