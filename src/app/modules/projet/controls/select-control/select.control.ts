import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

import { AbstractControl } from '../abstract.control';

@Component({ template: '' })
export class SelectControl extends AbstractControl implements OnInit, OnDestroy {

  //etiquette pour la zone de saisie
  @Input() label: string;
  //liste des options disponibles
  @Input() options: any[] = [];
  //options désactivées
  @Input() optionsDisabled: any[] = [];
  //valeur retourner par la zone de saisie
  value: (option) => any;
  //valeur affiché à l'utilisateur
  optionDisplayFn: (option) => any;
  //état de chargement des données
  @Input() loading: boolean = false;

  constructor() { 
    super();
  }

  ngOnInit() {
    super.ngOnInit();

    if (this.optionDisplayFn === undefined) {
      throw 'input optionDisplayFn is not defined';
    }

    if (this.value === undefined) {
      throw 'input value is not defined';
    }
  }

  onClear(event) {
    event.stopPropagation();
    this.form.setValue(null);
  }

  isDisabled(option): boolean {
    return this.optionsDisabled.findIndex(e => e['@id'] === option['@id']) !== -1;
  }

  ngOnDestroy() {
    this._subscriptions.forEach(s => s.unsubscribe());
  }

}
