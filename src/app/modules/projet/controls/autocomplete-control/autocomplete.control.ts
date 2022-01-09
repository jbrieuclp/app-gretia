import { Component, OnInit, OnDestroy, Input, ViewChild, ElementRef } from '@angular/core';
import { MatAutocompleteTrigger, MatAutocomplete } from "@angular/material";
import { FormControl } from "@angular/forms";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, map, startWith, tap, distinctUntilChanged, debounceTime, skip } from 'rxjs/operators';

import { AbstractControl } from '../abstract.control';
import { AutocompleteService } from './autocomplete.service';

@Component({ 
  selector: 'app-projet-control-autocomplete',
  templateUrl: './autocomplete.control.html',
  styleUrls: ['./autocomplete.control.scss'],
  providers: [AutocompleteService] 
})
export class AutocompleteControl extends AbstractControl implements OnInit, OnDestroy {

  //etiquette pour la zone de saisie
  @Input() label: string;
  //liste des options disponibles
  @Input() set options(value) { this.autocompleteS.options.next(value); };
           get options() { return this.autocompleteS.options.getValue(); };
  //options désactivées
  @Input() optionsDisabled: any[] = [];
  //valeur retourner par la zone de saisie
  @Input() value: (option) => any;
  //valeur affiché à l'utilisateur
  @Input() optionDisplayFn: (option) => any;
  //état de chargement des données
  @Input() loading: boolean = false;
  //possibilité de vider la valeur par un bouton
  @Input() clearable: boolean = true;

  get inputTerm(): FormControl { return this.autocompleteS.inputTerm; };
  get displayOptions(): any[] { return this.autocompleteS.displayOptions.getValue(); };
  
  @ViewChild(MatAutocompleteTrigger, { static: true }) autocompleteTrigger: MatAutocompleteTrigger;
  @ViewChild(MatAutocomplete, { static: true }) auto: MatAutocomplete;

  constructor(
    protected el: ElementRef,
    private autocompleteS: AutocompleteService
  ) { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    this.autocompleteS.formSubject.next(this.form);
    this.autocompleteS.value = this.value;
    this.autocompleteS.optionDisplayFn = this.optionDisplayFn;
  }

  onSelectOption(value) {
    this.form.setValue(value);
  }

  onClick(event: Event) {
    this.autocompleteS.displayOptions.next(this.options)
    this.autocompleteTrigger.openPanel();
    setTimeout(() => {
      if (this.auto.panel && this.auto.panel.nativeElement.querySelector('.mat-selected') !== null) {
        this.auto.panel.nativeElement.querySelector('.mat-selected').scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'start' })
      }
    }, 50);
  }

  onClear(event) {
    event.stopPropagation();
    this.form.setValue(null);
    this.inputTerm.setValue(null)
  }

  onClosed() {
    if ( this.inputTerm.value === '' && this.clearable === true) {
      this.form.setValue(null);
    } else if ( this.form.value !== null && this.form.value !== this.inputTerm.value) {
      this.inputTerm.setValue(this.form.value);
    }
  }

  isDisabled(option): boolean {
    return this.optionsDisabled.findIndex(e => e['@id'] === option['@id']) !== -1;
  }

  displayFn(value) {
    if (value) {
      const elem = this.options.find(option => this.value(option) === value);
      return elem !== undefined ? this.optionDisplayFn(elem) : '';
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

}
