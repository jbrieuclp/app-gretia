import { Component, OnInit, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { FormMapperComponent } from './form-mapper.component';

import { ImportService } from '../../../services/import.service';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-import-mapper',
  templateUrl: './mapper.component.html',
  styleUrls: ['./mapper.component.scss'],
  providers: [FileService]
})
export class FileMapperComponent implements OnInit, OnDestroy {

	fichier: any;
	_fields: any[] = [];

  get fields(): any[] {
    return this._fields.sort((t1, t2) => {
      const name1 = t1.champ.toLowerCase();
      const name2 = t2.champ.toLowerCase();
      if (name1 > name2) { return 1; }
      if (name1 < name2) { return -1; }
      return 0;
    })||[];
  }
  set fields(fields) { this._fields = fields; }

  @ViewChildren('formMapper') formMappers: QueryList<FormMapperComponent>;

  constructor(
  	private importS: ImportService,
    public fileS: FileService
  ) { }

  ngOnInit() {
    this.fileS.file.subscribe(fichier=>this.fichier = fichier);
    this.fileS.fields.subscribe(fields=>this._fields = fields);
  }

  ngOnDestroy() {
    this.fileS.refreshFields();
  }

  /**
   * Action permettant de défaire le mappage d'un champ
   */
  removeMapping(field) {
    this.importS.deleteField(field.id)
          .subscribe(
            () => {
                this.fileS.refreshFields();
                field.id = null;
                field.description = null;
                field.fieldFSD = null;
                field.check = null;
            },
            error => { /*this.errors = error.error;*/ }
          );
  }

  autoMapping() {
    this.formMappers.forEach((item: FormMapperComponent) => {
      item.autoMap();
    });
  }

  openFieldForm() {
    
  }

}
