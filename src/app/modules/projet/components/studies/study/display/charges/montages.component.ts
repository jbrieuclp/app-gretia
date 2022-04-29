// import { Component, OnInit } from '@angular/core';
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
// import { filter, switchMap, map, tap } from 'rxjs/operators';

// import { Action, Study, Charge } from '../../../../repository/project.interface';
// import { StudyService } from '../study.service';
// import { StudyMontagesService } from './montages.service';
// import { ChargeFormDialog } from './charge-form.dialog';

// @Component({
//   selector: 'app-project-study-montages',
//   templateUrl: './montages.component.html',
//   styleUrls: ['./montages.component.scss']
// })
// export class MontagesStudyComponent implements OnInit {

//   get study(): Study { return this.studyS.study.getValue(); };

//   get actionsPreviCost(): number {
//     return this.studyMontagesS.charges.getValue()
//             .filter(item => item.chargeType.chargeTypeRef.isPerDay === true)
//             .map(item => item.quantity * item.unitCostApplied)
//             .reduce((prev, next) => prev + next, 0);
//   }

//   get actionsRealCost(): number { return this.studyMontagesS.actionsRealCost.getValue(); }
  
//   get materialsTotalCost(): number {
//     return this.studyMontagesS.charges.getValue()
//             .filter(item => item.chargeType.chargeTypeRef.isPerDay === false)
//             .map(item => item.quantity * item.unitCostApplied)
//             .reduce((prev, next) => prev + next, 0);
//   }

//   constructor(
//     public studyS: StudyService,
//     public studyMontagesS: StudyMontagesService,
//     public dialog: MatDialog,
//   ) { }

//   ngOnInit() {
//   }

//   openFormMontage(charge = null) {
//     const dialogConfig = new MatDialogConfig();

//     dialogConfig.width = '750px';
//     dialogConfig.position = {top: '70px'};
//     dialogConfig.disableClose = true;
//     dialogConfig.data = {
//       'charge': charge,
//       'formParam': {'isPerDay': true}
//     };

//     const dialogRef = this.dialog.open(ChargeFormDialog, dialogConfig);

//     dialogRef.afterClosed()
//       .pipe(
//         filter((res: any) => res !== false),
//         map((charge: Charge)=>{
//           let charges = this.studyMontagesS.charges.getValue();
//           const idx = charges.findIndex(c=>c['@id'] === charge['@id'])
//           if ( idx === -1) {
//             charges.push(charge);
//           } else {
//             charges[idx] = charge;
//           }
//           return charges;
//         })
//       )
//       .subscribe((charges: Charge[]) => this.studyMontagesS.charges.next(charges));
//   }

// }
