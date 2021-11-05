import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, map, startWith, tap, distinctUntilChanged, debounceTime, skip } from 'rxjs/operators';

import { AuthService } from '../../../../shared/auth/authentication.service';
import { ActionsRepository } from '../../repository/actions.repository';
import { Study, Action } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-action-control',
  templateUrl: './action-control.component.html',
  styleUrls: ['./action-control.component.scss']
})
export class ActionControlComponent implements OnInit {

	@Input() form: FormControl = new FormControl();
  @Input() required: boolean = false;
  get user() { return this.authService.getUser().getValue(); };
  actions: BehaviorSubject<Action[]> = new BehaviorSubject([]);
  displayStudies: BehaviorSubject<Study[]> = new BehaviorSubject([]);
  displayActions: BehaviorSubject<Action[]> = new BehaviorSubject([]);
  loading: boolean = false;

  /* FormControl de l'element input de recherche
   * Il est utilisé pour tester la valeur cherchée et selectionnée et ne pas renvoyer dans form la valeur saisie
   **/
  inputTerm: FormControl = new FormControl(null);
  @ViewChild(MatAutocompleteTrigger, { static: true }) trigger: MatAutocompleteTrigger;

  _displayAll: BehaviorSubject<boolean> = new BehaviorSubject(false);
  get displayAll(): boolean {return this._displayAll.getValue(); };
  set displayAll(value: boolean) { this._displayAll.next(value); };

  constructor(
    private authService: AuthService,
  	private actionR: ActionsRepository,
  ) {}

  ngOnInit() {  
    
    this.setObservable();

    this.getActions()
      .subscribe((actions: Action[]) => this.actions.next(actions));
  }

  private setObservable(): void {

    //Set term input with form value
    this.form.valueChanges
      .pipe(
        map((val) => val === null ? '' : val),
      )
      .subscribe((val) => this.inputTerm.setValue(val))

    this.inputTerm.valueChanges
      .pipe(
        filter(term => term !== this.form.value)
      )
      .subscribe(() => this.form.setValue(null, { emitEvent: false }));
  	
    //Gestion du filtre sur la liste de l'autocomplete
    //set display studies from filteres action list
  	combineLatest(
  		this.inputTerm.valueChanges
  			.pipe(
  				startWith(''), 
          debounceTime(300),
          distinctUntilChanged()
  			), 
  		this.actions.asObservable(),
      this._displayAll.asObservable()
        .pipe(
          distinctUntilChanged()
        ),
  	)
      .pipe(
        map(([term, actions, displayAll]: [string, Action[], boolean]): Action[] => this._filter(term, actions, displayAll)),
        tap((actions: Action[]) => this.displayActions.next(actions)),
        map((actions: Action[]): Study[] => {
          return actions.map(elem => elem.study)
                        .filter((elem, index, self) =>index === self.findIndex((t) => t['@id'] === elem['@id']))
        }),
      )
        .subscribe((studies: Study[]) => this.displayStudies.next(studies));

  }

  onSelectOption(value) {
    this.form.setValue(value);
  }

  onClick(event: Event) {
    this.trigger.openPanel();
  }

  private getActions(): Observable<Action[]> {
    this.loading = true;
    return this.actionR.actions_select()
      .pipe(
        map((data: any): Action[]=>data["hydra:member"]),
        tap(() => this.loading = false),
      );
    
  }

  getListActions(study: Study) {
    return this.displayActions.getValue().filter(elem => elem.study['@id'] === study['@id'])
  }


  private _filter(value: string, actions: Action[], displayAll: boolean = true): Action[] {
    const filterValue = this._removeAccent(value);

    actions = actions.filter(action => 
                    action['@id'] === filterValue || 
                      this._removeAccent(action.category.label).includes(filterValue) || 
                        this._removeAccent(action.study.label).includes(filterValue) || 
                          this._removeAccent(action.study.code).includes(filterValue)
                  );

    if (displayAll === false) {
      const user = this.user;
      actions = actions.filter(action => (action.attributions.map(attr => attr.employee.person.compteId).includes(user.id) ||
                                            action['@id'] === filterValue)
      );
    }

    return actions;

  }

  private _removeAccent(value): string {
  	return ((value.toLowerCase()).trim()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  displayFn(id) {
  	if (id) {
  		const elem = this.actions.getValue().find(action => action['@id'] === id);
  		return elem !== undefined ? `${elem.category.label} - ${elem.study.label}` : '';
  	}
	}

}