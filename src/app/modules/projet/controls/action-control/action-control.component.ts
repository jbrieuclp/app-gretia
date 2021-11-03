import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, map, startWith, tap, mergeMap, distinctUntilChanged, pairwise } from 'rxjs/operators';

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
  $actions: BehaviorSubject<Action[]> = new BehaviorSubject([]);
  filteredOptions: Observable<Study[]>;
  loading: boolean = false;
  label: string = 'Études';
  /* FormControl de l'element input de recherche
   * Il est utilisé pour tester la valeur cherchée et selectionnée et ne pas renvoyer dans form la valeur saisie
   **/
  inputTerm: FormControl = new FormControl(null);

  get actions(): Action[] {
  	return this.$actions.getValue();
  }

  get studies(): Observable<Study[]> {
    return this.filteredOptions
              .pipe(
                filter((actions: Action[]) => actions === undefined),
                map((actions: Action[]): Study[] => 
                  actions.map(elem => {
                            elem.study['actions'].push(elem);
                            return elem.study
                          })
                         .filter((elem, index, self) => index === self.findIndex((t) => t['@id'] === elem['@id']))
                )
              );
  }

  constructor(
  	private actionR: ActionsRepository
  ) { }

  ngOnInit() {  

  	this.loading = true;
  	this.actionR.actions_me_for_select()
  		.pipe(
        map((data: any): Action[]=>data["hydra:member"]),
        tap(() => this.loading = false),
      )
  		.subscribe((actions: Action[]) => this.$actions.next(actions));
	  
  	//Gère la selection de la valeur quand on est en mode edition
	  this.$actions.asObservable()
	  	.pipe(
	  		distinctUntilChanged(),
	  		filter((action: Action[]) => action.length > 0),
	  		tap((action: Action[]) => this.$actions.next(action))
	  	)
	  	.subscribe((loc: Action[]) => {
	  		if (this.form.value !== null && this.form.value['@id'] !== undefined) {
		      this.form.setValue(this.form.value['@id']);
		    }
	  	})

    //affiche le texte en fonction de la valeur de la valeur form
  	this.form.valueChanges
      .pipe(
        distinctUntilChanged(),
        filter((val) => val !== null),
      )
  	  .subscribe(val => this.inputTerm.setValue(val));

    //affiche le texte tapé ou le label d'une valeur selectionnée
    combineLatest(
      this.inputTerm.valueChanges
        .pipe(
          startWith(''),
        ), 
      this.$actions.asObservable()
    )
    .pipe(
      map(([value, actions])=> {
        const idx = actions.findIndex(action => this._removeAccent(action.study.label) === this._removeAccent(value) ||
                                              action['@id'] === value);
        return idx > -1 ? actions[idx] : null;
      }),
      tap((action: Action) => this.label = (action ? action.study.label : 'Study')),
      map((action: Action) => action ? action['@id'] : null)
    )
    .subscribe(val=>this.form.setValue(val));
	  

  	//Gestion du filtre sur la liste de l'autocomplete
  	this.filteredOptions = combineLatest(
	  		this.inputTerm.valueChanges
	  			.pipe(
	  				startWith(''), 
	  				filter(value=>!Number.isInteger(value) && value !== null)
	  			), 
	  		this.$actions.asObservable()
	  	)
      .pipe(
        map(([term, actions]: [string, Action[]]) => this._filter(term)),
        map((actions: Action[]): Study[] => this.transformToProjects(actions)),
      );

    this.form.valueChanges
      .pipe(
        distinctUntilChanged(),
        pairwise(),
        filter(([prev, next]: [any, any]) => prev !== null && next === null),
      )
      .subscribe(([value, actions])=> this.inputTerm.reset(''));

  }

  private transformToProjects(actions: Action[]): Study[] {
    const studies: Study[] = [];
    actions.forEach((action) => {
      const study_idx = studies.findIndex(study => study.id === action.study.id);
      if (study_idx === -1) {
        const study = action.study;
        study['actions'] = [action];
        studies.push(study);
      } else {
        studies[study_idx]['actions'].push(action);
      }
    });
    return studies;
  }

  private _filter(value: string): Action[] {
    const filterValue = this._removeAccent(value);

    return this.actions.filter(action => this._removeAccent(action.category.label).includes(this._removeAccent(value)) || 
                                      this._removeAccent(action.study.label).includes(this._removeAccent(value)) || 
                                        this._removeAccent(action.study.code).includes(this._removeAccent(value)));
  }

  private _removeAccent(value): string {
  	return ((value.toLowerCase()).trim()).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

  displayFn(id) {
  	if (id) {
  		const idx = this.actions.find(action => action['@id'] === id);
  		return idx !== undefined ? idx.label : '';
  	}
	}

}