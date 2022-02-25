import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import {Observable, of as observableOf} from 'rxjs';
import {map, startWith, filter} from 'rxjs/operators';

import { ImportService } from '../../../services/import.service';
import { FormMapperService } from './form-mapper.service';

@Component({
  selector: 'app-import-file-form-mapper',
  templateUrl: './form-mapper.component.html',
  styleUrls: ['./form-mapper.component.scss'],
})
export class FormMapperComponent implements OnInit {

	@Input() field: any;
	@Output() fieldChange = new EventEmitter<number>();
	searchControl = new FormControl();
	_options: any[] = [];

	get options(): any[] {
    return this._options.sort((t1, t2) => {
      const name1 = t1.description.toLowerCase();
      const name2 = t2.description.toLowerCase();
      if (name1 > name2) { return 1; }
      if (name1 < name2) { return -1; }
      return 0;
    })||[];
  }

  set options(options: any[]) { this._options = options; }

	filteredOptions: Observable<string[]>;

  constructor(
  	private importS: ImportService,
  	private formMapperS: FormMapperService
  ) { }

  ngOnInit() {
  	if ( this.field.fieldFSD !== null) {
  		this.searchControl.setValue(this.field.fieldFSD);
  	}
  	this.formMapperS.fsdValues
		  	.subscribe(options => {
		  		this.options = options;
		  		this.setFilteredOptions();
		  	});
  }

  setFilteredOptions() {
  	this.filteredOptions = this.searchControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.description),
        map(term => term ? this._filter(term) : this.options.slice())
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.champ.toLowerCase().includes(filterValue) || option.description.toLowerCase().includes(filterValue));
  }

  displayFn(fsd?: any): string | undefined {
    return fsd ? fsd.description : undefined;
  }

  submit(event) {
    console.log(this.field, event.option.value)
  	if (this.field.fichier !== null && event.option.value !== undefined) {
  		if ( this.field.id === null) {
	  		let values = {
          fichier: this.field.fichier, 
          champ: this.field.champ, 
          fieldFSD: event.option.value['@id']
        };
	  		this.importS.postField(this.field.fichier.id, values)
	  									.subscribe(field => {
	  										this.field = field;
	  										this.fieldChange.emit(this.field);
	  									});
	  	} else {
	  		this.importS.patch(this.field['@id'], {fieldFSD: event.option.value['@id']})
	  									.subscribe(field => {
	  										this.field = field;
	  										this.fieldChange.emit(this.field);
	  									});
	  	}
  	}
  }

  autoMap() {
    if (this.field.id === null) {
      let bestResult = 0;
      let bestOption;
      for (let i=0; i<this.options.length; i++) {
          let tempResult = 0;
          let optionTxt = this.sansAccent(this.options[i].description);

          //on parse le tableau de notre id de row
          for (let j=0; j<this.field.champ.length; j++) {
              let regexElement = new RegExp('.*('+this.field.champ[j]+').*', 'i'); //lettre par lettre on regarde si elle est dans le tableau de l'option en cour
              if ( optionTxt.match(regexElement) !== null ) { //si la lettre est dans l'option
                  tempResult++;
              }
          }

          //Une fois qu'on a testé toute nos lettres de l'ID on teste si le resultat est meilleur que le précédent
          if (tempResult > bestResult) {
              bestOption = this.options[i];
              bestResult = tempResult;
          }
      }
    }
  }

  sansAccent(str) {
    const accent = [
      /[\300-\306]/g, /[\340-\346]/g, // A, a
      /[\310-\313]/g, /[\350-\353]/g, // E, e
      /[\314-\317]/g, /[\354-\357]/g, // I, i
      /[\322-\330]/g, /[\362-\370]/g, // O, o
      /[\331-\334]/g, /[\371-\374]/g, // U, u
      /[\321]/g, /[\361]/g, // N, n
      /[\307]/g, /[\347]/g, // C, c
    ];
    const noaccent = ['A','a','E','e','I','i','O','o','U','u','N','n','C','c'];
     
    for(let i = 0; i < accent.length; i++){
      str = str.replace(accent[i], noaccent[i]);
    }
     
    return str;
  }

}
