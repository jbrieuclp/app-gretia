import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ImportService } from '../../../services/import.service';
import { FileService } from '../../../services/file.service';
import { FieldService } from '../field.service';

@Component({
  selector: 'app-import-field-observers',
  templateUrl: './observers.component.html',
  styleUrls: ['./observers.component.scss'],
  providers: [FileService]
})
export class FieldObserversComponent implements OnInit, OnDestroy {

	fichier: any;
	error: any;
	raw_data: any;
	_observers: any[];
  field_observer: any;
  private subscription: Subscription

  saving: boolean = false;
  loading: boolean = false;

  get good_observers(): any[] {
    if (!this._observers || this._observers === null) return [];
    return this._observers.filter(observer=>observer.ok);
  }

  get good_observers_multi_bd(): any[] {
    if (!this._observers || this._observers === null) return [];
    return this._observers.filter(observer=>observer.ok && observer.observers_bd.length > 1);
  }

  get bad_observers(): any[] {
    if (!this._observers || this._observers === null) return [];
    return this._observers.filter(observer=>!observer.ok);
  }

  set observers(observers: any[]) {
    this._observers = observers;
  }

  constructor(
  	private route: ActivatedRoute,
  	private router: Router,
  	private importS: ImportService,
  	private fieldS: FieldService,
    private fileS: FileService
  ) { }

  ngOnInit() {
    this.error = null;
    this.raw_data = this.fieldS.values;

    this.subscription = this.fileS.file
                                  .subscribe(fichier=>{
                                    this.fichier = fichier;
                                    this.getObserversField()
                                  });

  	//(re)chargement des observateurs à la récuperation de l'info du fichier correspondant
		this.fieldS.field
          .pipe(
            tap(()=>this.observers = null)
          )
          .subscribe(
      			field => {
              this.field_observer = field;
              this.getObservers();
            }
      		);
  }

  ngOnDestroy() {
  	this.fieldS.reset();
    this.subscription.unsubscribe()
  }

  /**
  *  Retourne le champ correspondant au FSD __OBSERVERS__
  */
  getObserversField() {
  	this.importS.getFieldByFSD(this.fichier.id, '__OBSERVERS__')
  									.subscribe(
  										field => {
  											this.fieldS.field = field;
  										}, 
  										error => this.error = error
  									);
  }

  /**
  *  Retourne les valeurs du champs osbervateur
  *  Retourne une liste des osbervateurs découpés par le pipe
  */
  getObservers() {
    this.loading = true;
    this.observers = null;
  	this.importS.getObservers(this.field_observer.id)
      .pipe(
        tap(() => this.loading = false)
      )
			.subscribe(
				observers => {
					this.observers = observers;
				}, 
				error => this.error = error
			);
  }

  selectionChange($event) {
    this.getObservers();
  }

  recuperationID() {
    this.saving = true;
    this.importS.setOberversIds(this.fichier.id)
      .pipe(
        tap(()=>this.saving = false)
      )
      .subscribe(
        observers => {
          //this.observers = observers;
        }, 
        error => this.error = error
      );
  }
}
