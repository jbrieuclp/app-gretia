import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ImportService } from '../../../services/import.service';
import { FieldService } from '../field.service';

@Component({
  selector: 'app-import-toolsbox',
  templateUrl: './toolsbox.component.html',
  styleUrls: ['./toolsbox.component.scss']
})
export class ToolsboxComponent implements OnInit {

	searchReplaceForm: FormGroup;
	field: any;

  constructor(
  	private fb: FormBuilder,
  	private _bottomSheetRef: MatBottomSheetRef<ToolsboxComponent>,
  	private importS: ImportService,
    private fieldS: FieldService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  	this.field = this.fieldS.field.getValue();
  	this.searchReplaceForm = this.fb.group({
        'search': ['', [Validators.required]],
        'replace': ['', [Validators.required]]
    });
  }

  searchReplace() {
  	if (this.searchReplaceForm.valid) {
  		this.importS.replaceFieldElement(this.field.id, this.searchReplaceForm.value)
  									.subscribe(result => {
  										//retour de la liste des valeurs mise à jour
  										this.fieldS.values.next(result);
  										this._snackBar.open('Liste des valeurs mise à jour', 'Fermer', {
									      duration: 4000,
									      verticalPosition: 'top'
									    });
									    this.searchReplaceForm.reset();
  									},
										error => { 
											this._snackBar.open('Une erreur est survenue', 'Fermer', {
									      duration: 4000,
									      verticalPosition: 'top'
									    }); 
  									});
  	}
  }

}
