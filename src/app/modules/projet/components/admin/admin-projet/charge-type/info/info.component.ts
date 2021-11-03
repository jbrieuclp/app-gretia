import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { tap, switchMap } from "rxjs/operators";
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmationDialogComponent } from '../../../../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ChargeTypeService } from '../charge-type.service';
import { ChargeTypeRefService } from '../charge-type-ref.service'
import { ChargeTypeRepository } from '../../../../../repository/charge-type.repository'
import { ChargeTypeRef } from '../../../../../repository/project.interface'

@Component({
  selector: 'app-projet-charge-type-ref-charge-types-info',
  templateUrl: './info.component.html',
  styleUrls: ['../../../../css/info.scss']
})
export class ChargeTypeInfoComponent implements OnInit {

	public chargeTypeRef: ChargeTypeRef;

  constructor(
  	public dialog: MatDialog,
  	private chargeTypeRefS: ChargeTypeRefService,
  	private chargeTypeR: ChargeTypeRepository,
  	private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  	this.chargeTypeRefS.chargeTypeRefSelect.asObservable()
  		.subscribe(chargeTypeRef=>this.chargeTypeRef = chargeTypeRef);
  }

  edit(chargeTypeRef: ChargeTypeRef) {
    this.chargeTypeRefS.chargeTypeRefSelect.next(chargeTypeRef);
    this.chargeTypeRefS.moveStepper(1);
  }

  delete(chargeTypeRef: ChargeTypeRef) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression de la valeur "${chargeTypeRef.label}" ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.chargeTypeRefS.delete(chargeTypeRef);
      }
    }); 
  }

  openDialog(): void {

  	const dialogConfig = new MatDialogConfig();

  	dialogConfig.data = {
  		chargeTypeRef: this.chargeTypeRef,
  		chargeTypeRefS: this.chargeTypeRefS,
      isPerDay: this.chargeTypeRef.isPerDay,
  	};
  	dialogConfig.width = '485px';
  	dialogConfig.position = {top: '70px'};

    const dialogRef = this.dialog.open(InfoChargeTypeFormDialog, dialogConfig);
  }

  deleteRow(chargeType) {
  	const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: `Confirmer la suppression du contrat selectionné ?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.chargeTypeR.deleteChargeType(chargeType.id)
        	.pipe(
            switchMap(()=>{
              return this.chargeTypeR.chargeTypeRef(this.chargeTypeRefS.chargeTypeRefSelect.getValue().id)
            }),
	  				tap(()=>this.snackBar.open('Ligne supprimée', 'Fermer'))
	  			)
          .subscribe((chargeTypeRef)=>this.chargeTypeRefS.chargeTypeRefSelect.next(chargeTypeRef));
      }
    });
  }
}



/**********
* DIALOG
**********/
@Component({
  selector: 'app-projet-charge-type-form-charge-type',
  templateUrl: './charge-type-form.dialog.html'
})
export class InfoChargeTypeFormDialog implements OnInit {

	public form: FormGroup;

  constructor (
    public dialogRef: MatDialogRef<InfoChargeTypeFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private chargeTypeS: ChargeTypeService,
    private chargeTypeR: ChargeTypeRepository,
  ) {}


  ngOnInit() {
    console.log(this.data.isPerDay)
    this.form = this.chargeTypeS.createForm();
    if (this.data.isPerDay === false) {
      this.form.addControl('unitCost', new FormControl(null, Validators.required));
    }
  }

  submit() {
  	if (this.form.valid) {
  		const data = this.form.value;
  		data.chargeTypeRef = this.data.chargeTypeRef["@id"];
  		this.chargeTypeR.createChargeType(data)
        .pipe(
          switchMap(()=>{
            return this.chargeTypeR.chargeTypeRef((this.data.chargeTypeRefS as ChargeTypeRefService).chargeTypeRefSelect.getValue().id)
          }),
          tap((chargeTypeRef: ChargeTypeRef)=>(this.data.chargeTypeRefS as ChargeTypeRefService).chargeTypeRefSelect.next(chargeTypeRef))
        )
  			.subscribe(()=>this.dialogRef.close());
  	}
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}