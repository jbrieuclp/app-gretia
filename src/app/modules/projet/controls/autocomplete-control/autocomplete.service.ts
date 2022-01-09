import { Injectable } from '@angular/core';
import { FormControl } from "@angular/forms";
import { combineLatest, BehaviorSubject, Subject, Subscription } from 'rxjs';
import { filter, map, startWith, tap, distinctUntilChanged, debounceTime, skip, take } from 'rxjs/operators';

@Injectable()
export class AutocompleteService {

  formSubject: Subject<FormControl> = new Subject();
  inputTerm: FormControl = new FormControl();
  value: (option) => any;
  optionDisplayFn: (option) => any;

  options: BehaviorSubject<any[]> = new BehaviorSubject([]);
  displayOptions: BehaviorSubject<any[]> = new BehaviorSubject(null);

  subscription: Subscription = new Subscription();

  constructor () { 
  	this.setObservables();
  }

  private setObservables(): void {
    //Gestion du filtre sur la liste de l'autocomplete
    combineLatest(
      this.inputTerm.valueChanges
        .pipe(
          startWith(''), 
          debounceTime(300),
          distinctUntilChanged(),
        ), 
      this.options.asObservable()
    )
      .pipe(
        map(([term, options]: [string, any[]]): any[] => this._filter(term, options)),
      )
      .subscribe((options: any[]) => this.displayOptions.next(options));
    
    //Set term input with form value
    this.formSubject
      .pipe(
        tap(() => this.subscription.unsubscribe())
      )
      .subscribe(form => this.setFormSub(form))
  }

  private setFormSub(form: FormControl): void {
    this.subscription = 
      combineLatest(
        form.valueChanges
          .pipe(
            startWith(form.value),
            map((val) => val === null ? '' : val),
          ),
        this.options.asObservable()
      )
        .pipe(
          map(([val, options]) => val)
        )  
        .subscribe((val) => this.inputTerm.setValue(val))
  }

  private _filter(value: string, options: any[]): any[] {
    //si value === null on restitue tout
    if (value === null) {
      return options;
    }
    const filterValue = this._removeAccent(value);

    return options.filter(option => {
            return this.value(option) === filterValue || 
                     this._removeAccent(this.optionDisplayFn(option)).includes(filterValue)
            });
  }

  private _removeAccent(value): string {
    if ( typeof value === 'number') { value = value.toString(); }

    return ((value.toLowerCase()).trim()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

}
