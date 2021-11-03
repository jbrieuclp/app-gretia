import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { tap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared';
import { FundingTypeService } from './funding-type.service';
import { FundingTypeRefService } from '../funding-type-ref.service';

@Component({
  selector: 'app-projet-funding-type-form',
  templateUrl: './funding-type-form.component.html',
  styleUrls: ['./funding-type-form.component.scss']
})
export class FundingTypeFormComponent implements OnInit {

	form: FormGroup;
  isEdit(): boolean {
    return this.fundingTypeS.fundingType.getValue() !== null;
  }

  @Output() refreshFundingTypeRef = new EventEmitter<any>();

  constructor(
    private fundingTypeS: FundingTypeService,
    private fundingTypeRefS: FundingTypeRefService,
    private globalsS: GlobalsService,
  ) { }

  ngOnInit() {
    this.form = this.fundingTypeS.form;

    this.fundingTypeS.fundingTypeRef = this.fundingTypeRefS.fundingTypeRef.getValue();
  }

  save() {
    this.fundingTypeS.submit()
      .pipe(
        tap(() => this.globalsS.snackBar({msg: "Enregistrement effectué"}))
      )
      .subscribe(
        () => this.refreshFundingTypeRef.emit(),
        (err) => {
          let msg = err.error.violations.map(v => v.message);
          this.globalsS.snackBar({msg: msg.join("\n"), color: 'red', duration: null});
        }
      );
  }

  cancel() {
    this.fundingTypeS.reset();
    this.fundingTypeS.moveStepper(0);
  }
}
