import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, Validators } from "@angular/forms";
import { MatAutocompleteTrigger } from "@angular/material";
import { Observable, of, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, map, startWith, tap, distinctUntilChanged, debounceTime, skip, take } from 'rxjs/operators';

import { AuthService } from '../../../../shared/auth/authentication.service';
import { ActionsRepository } from '../../repository/actions.repository';
import { StudiesRepository } from '../../repository/studies.repository';
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
  @Input() onlyStudy: boolean = true;
  get user() { return this.authService.getUser().getValue(); };
  studies: BehaviorSubject<Study[]> = new BehaviorSubject([]);
  displayStudies: BehaviorSubject<Study[]> = new BehaviorSubject([]);
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
    private studiesR: StudiesRepository,
  ) {}

  ngOnInit() {  
    
    // this.setObservable();

    this.setObservable();
    this.getStudies()
      .subscribe((studies: Study[]) => this.studies.next(studies));

    if (this.onlyStudy) {
      this.onChangeStudySwitcher(true);
      // this.selectStudySwitcher = true;
    }
  }

  ngAfterViewInit() {
  }

  private setObservable(): void {

    this.inputTerm.valueChanges
      .pipe(
        map((value: any): string => {
          if (typeof value === 'object') {
            return value.action !== null ? value.action : value.study
          }
          return value;
        }),
        filter(value => value !== this.actionForm.value && value !== this.studyForm.value
        )
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
          map((value: any): string => {
            if (typeof value === 'object') {
              return value.action !== null ? value.action : value.study
            }
            return value;
          })
  			), 
  		this.studies.asObservable().pipe(skip(1)),
      this._displayAll.asObservable()
        .pipe(
          distinctUntilChanged()
        ),
  	)
      .pipe(
        map(([term, studies, displayAll]: [string, Study[], boolean]): Study[] => this._filter(term, studies, displayAll)),
      )
        .subscribe((studies: Study[]) => this.displayStudies.next(studies));

    //Set term input with form value
    combineLatest(
      this.actionForm.valueChanges.pipe(startWith(this.actionForm.value)),
      this.studyForm.valueChanges.pipe(startWith(this.studyForm.value)),
      this.studies.asObservable().pipe(skip(1)),
    )
      .pipe(
        tap(([action, study, studies]) => {
          //si on laisse le choix d'afficher action ou étude
          if (!this.onlyStudy) {
            this.selectStudySwitcher = !(action !== null || study === null)
          }
        }),
        map(([action, study, studies]): any => {
          if (action !== null || study !== null) {
            return {'action': action, 'study': study};
          }
          return '';
        })
      )
      .subscribe((val) => this.inputTerm.setValue(val));


    // this.actionForm.valueChanges
    //   .pipe(
    //     filter((action_id) => action_id !== null),
    //     map((action_id) => {
    //       const elem = this.actions.getValue().find(elem => elem['@id'] === action_id);
    //       return elem !== undefined ? elem.study['@id'] : null;
    //     })
    //   )
    //   .subscribe((study_id) => this.studyForm.setValue(study_id, { emitEvent: false }));
  }

  onSelectOption(value) {
    this.actionForm.setValue(value.action)
    this.studyForm.setValue(value.study);
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

  private getStudies(): Observable<Study[]> {
    this.loading = true;
    return this.studiesR.studies_select({"isActive": "true"})
      .pipe(
        map((data: any): Study[]=>data["hydra:member"]),
        tap(() => this.loading = false),
      );
    
  }

  private _filter(value: string, studies: Study[], displayAll: boolean = true): Study[] {
    const filterValue = this._removeAccent(value);

    let filteredStudies = JSON.parse(JSON.stringify(studies));

    filteredStudies = filteredStudies.filter(study => {
      //si la study est directement concernée par le filtre on retourne tout en l'état (avec l'ensemble des actions)
      if (
        study['@id'] === filterValue || 
          this._removeAccent(study.label).includes(filterValue) ||
            this._removeAccent(study.code).includes(filterValue)
      ) {
        return true;
      }

      //on recherche au niveau des actions si ca correspond au filtre ou pas
      //on filtre les actions 
      study.actions = study.actions.filter(action => 
                            action['@id'] === filterValue ||
                              this._removeAccent(action.label).includes(filterValue)
                      );

      return study.actions.length > 0;

    });

    if (displayAll === false) {
      const user = this.user;
      //on conserve la study si jamais : 
      filteredStudies = filteredStudies.filter(study => {
        // - l'utilisateur est associé par une action : isAssociatedUser:boolean = true;
        const isAssociatedUser =  study.actions
                                    .filter(action => action.attributions.map(attr => attr.employee.person.compteId).includes(user.id))
                                    .length > 0;

        // - si une action de la study correspond à la valeur filtrée : isSelectedAction:boolean = true;
        const isSelectedAction =  study.actions
                                    .filter(action => action['@id'] === filterValue)
                                    .length > 0;

        // - si le formulaire correspond à l'étude
        const isSelectedStudy =  study['@id'] === filterValue;

        //si le formulaire correspond à une action non associé à l'utilisateur on switch le bouton
        if (!isAssociatedUser && (isSelectedAction || isSelectedStudy)) {
          this.displayAll = true;
        }

        // Dans le cas où ce n'est pas l'étude qui est selectionnée par le formulaire
        // - on filtre les actions selon la valeur du form ou alors selon l'association de l'action à l'user
        if (!isSelectedStudy) {
          study.actions = study.actions.filter(action => action.attributions.map(attr => attr.employee.person.compteId).includes(user.id) ||
                                                              action['@id'] === filterValue);
        } 

        //on filtre les studies qui ont au moins une action ou qui sont disponible pour tout le monde
        return study.actions.length > 0 || study.availableForAll;
      });
    }

    return filteredStudies;

  }

  private _removeAccent(value): string {
  	return value !== null ? ((value.toLowerCase()).trim()).normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
  }

  displayFn(value) {
  	if (value && typeof value === 'object') {
      if (value.action !== null) {
        //action
        let select_action;
        let select_study;
        (this.studies.getValue()).forEach(study => {
          const idx = study.actions.findIndex(action => action['@id'] === value.action);
          if (idx !== -1) {
            select_study = study;
            select_action = study.actions[idx];
            return;
          }
        });
    		// const elem = (this.studies.getValue()).actions.find(action => action['@id'] === id);
    		return select_action !== undefined ? `${select_action.label} - (${select_study.code} - ${select_study.label})` : '';   
      } else {
        //study
        const elem = this.studies.getValue().find(study => study['@id'] === value.study);
        return elem !== undefined ? `${elem.code} - ${elem.label}` : '';  
      }
  	}
	}

}