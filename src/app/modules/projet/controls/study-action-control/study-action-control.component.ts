import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, map, startWith, tap, distinctUntilChanged, debounceTime, skip, take } from 'rxjs/operators';

import { AuthService } from '../../../../shared/auth/authentication.service';
import { ActionsRepository } from '../../repository/actions.repository';
import { Study, Action } from '../../repository/project.interface';

@Component({
  selector: 'app-projet-action-control',
  templateUrl: './study-action-control.component.html',
  styleUrls: ['./study-action-control.component.scss']
})
export class StudyActionControlComponent implements OnInit, AfterViewInit {

	@Input() actionForm: FormControl = new FormControl();
  @Input() studyForm: FormControl = new FormControl();
  @Input() required: boolean = false;
  @Input() onlyStudy: boolean = false;
  get user() { return this.authService.getUser().getValue(); };
  actions: BehaviorSubject<Action[]> = new BehaviorSubject([]);
  displayStudies: BehaviorSubject<Study[]> = new BehaviorSubject([]);
  displayActions: BehaviorSubject<Action[]> = new BehaviorSubject([]);
  loading: boolean = false;
  selectStudySwitcher: boolean = false;

  get element(): 'action'|'étude' { return this.selectStudySwitcher ? 'étude' : 'action'};

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
    
    // this.setObservable();

    this.setObservable();
    this.getActions()
      .subscribe((actions: Action[]) => this.actions.next(actions));

    if (this.onlyStudy) {
      this.selectStudySwitcher = true;
    }
  }

  ngAfterViewInit() {
  }

  private setObservable(): void {

    this.inputTerm.valueChanges
      .pipe(
        filter(term => term !== this.actionForm.value && term !== this.studyForm.value)
      )
      .subscribe(() => {
        this.actionForm.setValue(null, { emitEvent: false })
        this.studyForm.setValue(null, { emitEvent: false })
      });
  	
    //Gestion du filtre sur la liste de l'autocomplete
    //set display studies from filteres action list
  	combineLatest(
  		this.inputTerm.valueChanges
  			.pipe(
  				startWith(''), 
          debounceTime(300),
          distinctUntilChanged(),
  			), 
  		this.actions.asObservable().pipe(skip(1)),
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

    //Set term input with form value
    combineLatest(
      this.actionForm.valueChanges.pipe(startWith(this.actionForm.value)),
      this.studyForm.valueChanges.pipe(startWith(this.studyForm.value)),
      this.actions.asObservable().pipe(skip(1)),
    )
      .pipe(
        tap(([action, study, actions]) => {
          //si on laisse le choix d'afficher action ou étude
          if (!this.onlyStudy) {
            this.selectStudySwitcher = !(action !== null || study === null)
          }
        }),
        map(([action, study, actions]) => action !== null ? action : study),
        map((val) => val === null ? '' : val),
      )
      .subscribe((val) => this.inputTerm.setValue(val));


    this.actionForm.valueChanges
      .pipe(
        filter((action_id) => action_id !== null),
        map((action_id) => {
          const elem = this.actions.getValue().find(elem => elem['@id'] === action_id);
          return elem !== undefined ? elem.study['@id'] : null;
        })
      )
      .subscribe((study_id) => this.studyForm.setValue(study_id, { emitEvent: false }));
  }

  onSelectOption(value) {
    if (!this.selectStudySwitcher) {
      this.actionForm.setValue(value);
    } else {
      this.actionForm.setValue(null)
      this.studyForm.setValue(value);
    }
  }

  onClick(event: Event) {
    this.trigger.openPanel();
  }

  onChangeStudySwitcher(state) {
    this.selectStudySwitcher = state;
    if (state) {
      this.actionForm.setValue(null, { emitEvent: false });
      this.inputTerm.setValue(this.studyForm.value||'');
    } else {
      this.studyForm.setValue(null, { emitEvent: false });
    }
    this.actionForm.setValidators(state ? [] : [Validators.required]);
    this.actionForm.updateValueAndValidity({ emitEvent: false });
  }

  getText(template) {
    return template.replace('${element}', this.element);
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
                      action.study['@id'] === filterValue ||
                        this._removeAccent(action.label).includes(filterValue) || 
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
      if (!this.selectStudySwitcher) {
        //action
    		const elem = this.actions.getValue().find(action => action['@id'] === id);
    		return elem !== undefined ? `${elem.label} - ${elem.study.label}` : '';   
      } else {
        //study
        const elem = this.displayStudies.getValue().find(study => study['@id'] === id);
        return elem !== undefined ? `${elem.code} ${elem.label}` : '';  
      }
  	}
	}

}