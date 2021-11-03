import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, map, startWith, tap, mergeMap, distinctUntilChanged } from 'rxjs/operators';

import { AbstractControl } from '../abstract.control';
import { StudiesRepository } from '../../repository/studies.repository';
import { Study } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-study-control',
  templateUrl: './study-control.component.html',
  styleUrls: ['./study-control.component.scss']
})
export class StudyControlComponent extends AbstractControl implements OnInit {

  @Input() set options(options) { this.$studys.next(options); }
  $studys: BehaviorSubject<Study[]> = new BehaviorSubject([]);
  filteredOptions: Observable<Study[]>;
  get studys(): Study[] { return this.$studys.getValue(); };

  constructor(
  	private studyR: StudiesRepository
  ) { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.form.setValidators([this.form.validator, Validators.pattern('^\/api\/project\/studies\/[0-9]+$')]);

  	this.getOptions()
  		.subscribe((studys: Study[])=>this.$studys.next(studys));

    // necessaire pour rafraichir l'affichage du label de la selection une fois que les données soient chargées
    this.$studys.asObservable()
      .subscribe(() => this.form.setValue(this.form.value));	  

  	//Gestion du filtre sur la liste de l'autocomplete
  	this.filteredOptions = combineLatest(
	  		this.form.valueChanges
	  			.pipe(
	  				startWith(''), 
	  				filter(value=>!Number.isInteger(value) && value !== null),
            map(value => value['@id'] !== undefined ? value['@id'] : value)
	  			), 
	  		this.$studys.asObservable()
	  	)
      .pipe(
        map(([term, studys]: [string, Study[]]) => this._filter(term)),
      );
  }

  getOptions(): Observable<any> {
    this.loading = true;
    return this.studyR.studies_select()
      .pipe(
        map((data: any): Study[]=>data["hydra:member"]),
        tap(() => this.loading = false)
      )
  }

  private _filter(value: string): Study[] {
    const filterValue = this._removeAccent(value);

    return this.studys.filter(study => this._removeAccent(study.label).includes(this._removeAccent(value)));
  }

  private _removeAccent(value): string {
  	return ((value.toLowerCase()).trim()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  displayFn(id) {
  	if (id) {
  		const study = this.$studys.getValue().find(study => study['@id'] === id);
  		return study !== undefined ? study.label : '';
  	}
	}

}
