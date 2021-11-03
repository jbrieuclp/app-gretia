import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Observable, of, combineLatest, BehaviorSubject, Subscription } from 'rxjs';
import { filter, map, startWith, tap, mergeMap, distinctUntilChanged } from 'rxjs/operators';

import { StudiesRepository } from '../../repository/studies.repository';
import { Localisation } from '../../repository/project.interface';

@Component({
  selector: 'app-study-control-localisation',
  templateUrl: './localisation-control.component.html',
  styleUrls: ['./localisation-control.component.scss']
})
export class LocalisationControlComponent implements OnInit, OnDestroy {

	@Input() form: FormControl = new FormControl();
  _localisations: BehaviorSubject<Localisation[]> = new BehaviorSubject([]);
  filteredOptions: Observable<Localisation[]>;
  loading: boolean = false;
  _subscriptions: Subscription[] = [];

  get localisations(): Localisation[] {
  	return this._localisations.getValue();
  }

  constructor(
  	private studyR: StudiesRepository
  ) { }

  ngOnInit() {  
  	this.loading = true;
  	
  	this._subscriptions.push(
  		this.studyR.localisations()
	  		.pipe(
	        map((data: any): Localisation[]=>data["hydra:member"]),
	        tap(() => this.loading = false)
	      )
	  		.subscribe((localisations: Localisation[])=>{ this._localisations.next(localisations) })
	  );
	  
  	//Gère la selection de la valeur quand on est en mode edition
  	this._subscriptions.push(
		  this._localisations.asObservable()
		  	.pipe(
		  		distinctUntilChanged(),
		  	)
		  	.subscribe((loc: Localisation[]) => {
			    this.form.setValue(this.form.value);
		  	})
		);

  	// selectionne automatiquement la valeur de la liste si elle correspond à une valeur existante
		this._subscriptions.push(
			combineLatest(
	  		this.form.valueChanges
		  		.pipe(
		  			startWith(''),
		  			filter(value=> !Number.isInteger(value) && value !== null),
		  		), 
		  	this._localisations.asObservable()
		  )
	  	.pipe(
	  		map(([value, localisations])=> {
					const idx = localisations.findIndex(loc=>this._removeAccent(loc.name) === this._removeAccent(value));
					return idx > -1 ? localisations[idx]['@id'] : null;
				}),
				filter(value=> value !== null)
	  	)
	  	.subscribe(val=>this.form.setValue(val))
	  );
	  
  }

  private _filter(value: string): Localisation[] {
    const filterValue = this._removeAccent(value);

    return this.localisations.filter(loc => this._removeAccent(loc.name).includes(this._removeAccent(value)));
  }

  private _removeAccent(value): string {
  	return ((value.toLowerCase()).trim()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  displayFn(id) {
  	if (id) {
  		const idx = this.localisations.find(loc => loc['@id'] === id);
  		return idx !== undefined ? idx.name : '';
  	}
	}

	/**
	* Affiche le bouton d'enregistrement d'une nouvelle localisation que dans certain cas
	**/
	get buttonDisplay(): boolean {
		if (
			this.form.valid || 
			this.form.value === null || 
			this.form.value === '' || 
			this.localisations.findIndex(loc=>loc['@id'] === this.form.value) > -1) {
			return false;
		}
		return true;
	}

	addLocalisation() {
		if (this.form.valid) {
			this.studyR
	      .createLocalisation({name: this.form.value})
	      .pipe(
	      	mergeMap(
	      		localisation=> this.studyR.localisations(),
	      		(localisation, localisations) => {
	      			return [localisation, localisations["hydra:member"]];
	      		}
	      	),
	      	tap(([localisation, localisations]: [Localisation, Localisation[]])=>this._localisations.next(localisations)),
	      	map(([localisation, localisations]: [Localisation, Localisation[]])=>localisation)
	      )
	      .subscribe(
	        (localisation: Localisation) => this.form.setValue(localisation['@id']),
	        (err) => {
	          //this._commonService.translateToaster("error", "ErrorMessage");
	        }
	      );
		}
	}

	ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

}
