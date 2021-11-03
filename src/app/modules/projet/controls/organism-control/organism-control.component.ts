import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, map, startWith, tap, mergeMap, distinctUntilChanged } from 'rxjs/operators';

import { AbstractControl } from '../abstract.control';
import { OrganismRepository } from '../../repository/organism.repository';
import { Organism } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-control-organism',
  templateUrl: './organism-control.component.html',
  styleUrls: ['./organism-control.component.scss']
})
export class OrganismControlComponent extends AbstractControl implements OnInit {

  $organisms: BehaviorSubject<Organism[]> = new BehaviorSubject([]);
  filteredOptions: Observable<Organism[]>;

  get organisms(): Organism[] {
  	return this.$organisms.getValue();
  }

  constructor(
  	private organismR: OrganismRepository
  ) { 
  	super(); 
 	}

  ngOnInit() {  	
  	this.loading = true;
  	this.organismR.organisms()
  		.pipe(
        map((data: any): Organism[]=>data["hydra:member"]),
        tap(() => this.loading = false)
      )
  		.subscribe((organisms: Organism[])=>this.$organisms.next(organisms));
	  
  	//Gère la selection de la valeur quand on est en mode edition
	  this.$organisms.asObservable()
	  	.pipe(
	  		distinctUntilChanged(),
	  		filter((org: Organism[]) => org.length > 0),
	  		tap((org: Organism[]) => this.$organisms.next(org))
	  	)
	  	.subscribe((org: Organism[]) => {
	  		if (this.form.value !== null && this.form.value['@id'] !== undefined) {
		      this.form.setValue(this.form.value['@id']);
		    }
	  	})

  	// selectionne automatiquement la valeur de la liste si elle correspond à une valeur existante
  	combineLatest(
  		this.form.valueChanges
	  		.pipe(
	  			startWith(''),
	  			filter(value=> !Number.isInteger(value) && value !== null),
	  			map(value => value['@id'] !== undefined ? value['@id'] : value)
	  		), 
	  	this.$organisms.asObservable()
	  )
  	.pipe(
  		map(([value, organisms])=> {
				const idx = organisms.findIndex(org => this._removeAccent(org.name) === this._removeAccent(value))
				return idx > -1 ? organisms[idx]['@id'] : null;
			}),
			filter(value=> value !== null)
  	)
  	.subscribe(val=>this.form.setValue(val));
	  

  	//Gestion du filtre sur la liste de l'autocomplete
  	this.filteredOptions = combineLatest(
	  		this.form.valueChanges
	  			.pipe(
	  				startWith(''), 
	  				filter(value=>!Number.isInteger(value) && value !== null),
	  				map(value => value['@id'] !== undefined ? value['@id'] : value)
	  			), 
	  		this.$organisms.asObservable()
	  	)
      .pipe(
        map(([term, organisms]: [string, Organism[]]) => this._filter(term)),
      );
  }

  private _filter(value: string): Organism[] {
    const filterValue = this._removeAccent(value);

    return this.organisms.filter(org => this._removeAccent(org.name).includes(this._removeAccent(value)));
  }

  private _removeAccent(value): string {
  	return ((value.toLowerCase()).trim()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  displayFn(id) {
  	if (id) {
  		const idx = this.organisms.find(org => org['@id'] === id);
  		return idx !== undefined ? idx.name : '';
  	}
	}

	/**
	* Affiche le bouton d'enregistrement d'une nouvelle organism que dans certain cas
	**/
	get buttonDisplay(): boolean {
		if (
			this.form.valid || 
			this.form.value === null || 
			this.form.value === '' || 
			this.organisms.findIndex(org=>org['@id'] === this.form.value) > -1) {
			return false;
		}
		return true;
	}

	addOrganism() {
		if (this.form.value !== null && isNaN(this.form.value)) {
			this.organismR
	      .postOrganisms({name: this.form.value.trim()})
	      .pipe(
	      	mergeMap(
	      		organism=> this.organismR.organisms(),
	      		(organism, organisms) => {
	      			return [organism, organisms["hydra:member"]];
	      		}
	      	),
	      	tap(([organism, organisms]: [Organism, Organism[]])=>this.$organisms.next(organisms)),
	      	map(([organism, organisms]: [Organism, Organism[]])=>organism)
	      )
	      .subscribe(
	        (organism: Organism) => this.form.setValue(organism['@id']),
	        (err) => {
	          //this._commonService.translateToaster("error", "ErrorMessage");
	        }
	      );
		}
	}

}
