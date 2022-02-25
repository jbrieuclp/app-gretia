import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { TableService } from './table.service';
import { ImportService } from '../../../services/import.service';

@Component({
  selector: '[app-cell]',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

	@Input() row: any;
	@Input() key: string;
	@Output() rowChange = new EventEmitter<any>();
	displayForm: boolean = false;
  private _closeAction: boolean;
	formValue: string;

  constructor(
  	private tableS: TableService,
  	private importS: ImportService,
  	private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  	this.formValue = this.row[this.key];
  }

  switchDisplay() {
    if (!this._closeAction) {
      this.displayForm = true;
    }
    this._closeAction = false;
  }

  submit() {
  	let request = {};
  	request[this.key] = this.formValue;
  	this.importS.patchTableCell(this.tableS.fichierId, this.row.adm_id_import, request)
  							.subscribe(
  								result => {
	  								this.displayForm = false;
                    this._closeAction = true;
								  	this.row[this.key] = this.formValue;
								  	this.rowChange.emit(this.row);
	  							},
	  							error => {
	  								this._snackBar.open(error.error.message, 'Fermer', {
															      duration: 4000,
															      verticalPosition: 'top'
															    })
	  						});
  }

  cancel() {
  	this.displayForm = false;
    this._closeAction = true;
  	this.formValue = this.row[this.key];
  }
}
