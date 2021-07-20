import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

import * as moment from 'moment';

import { ChargeTypeRepository, ChargeType } from '../../repository/charge-type.repository';
import { Projet } from '../../repository/projet.repository';

@Component({
  selector: 'app-projet-control-charge-type',
  templateUrl: './charge-type-control.component.html',
  styleUrls: ['./charge-type-control.component.scss']
})
export class ChargeTypeControlComponent implements OnInit {

	@Input() form: FormControl;
  @Input() dateFilter: Date;
  @Input() projectFilter: BehaviorSubject<Projet> = new BehaviorSubject(null);
  @Input() label: string = 'Charge';
  @Input() isPerDay: boolean = null;
  
  chargeTypes: ChargeType[] = [];
  loading: boolean;

  constructor(
  	private chargeTypeR: ChargeTypeRepository
  ) { }

  ngOnInit() {
    this.loading = true;

    //pour charger la valeur à partir d'un objet (en mode edition)
    if (this.form.value !== null && this.form.value['@id'] !== undefined) {
      this.form.setValue(this.form.value['@id']);
    }

    this.projectFilter.asObservable()
      .pipe(
        switchMap((projet: Projet) => {
          if (projet === null) {
            return this.chargeTypeR.chargeTypes({
                      "applicationStart[before]": moment(this.dateFilter).format('yyyy-MM-DD'),
                      "applicationEnd[after]": moment(this.dateFilter).format('yyyy-MM-DD')
                    })
          } else {
            return this.chargeTypeR.chargeTypes({
                      "applicationStart[before]": moment(this.dateFilter).format('yyyy-MM-DD'),
                      "applicationEnd[after]": moment(this.dateFilter).format('yyyy-MM-DD'),
                      "charges.project.id[]": projet.id,
                      "chargeTypeRef.isPerDay": true
                    })
          }
        }),
        map((data: any): ChargeType[]=>data["hydra:member"]),
        map((chargeTypes:ChargeType[]): ChargeType[] => {
          return chargeTypes.filter(c => this.isPerDay !== null ? c.chargeTypeRef.isPerDay === this.isPerDay : true)
        }),
        tap(() => this.loading = false)
      )
      .subscribe((chargeTypes:ChargeType[]) => this.chargeTypes = chargeTypes);
  }

}
