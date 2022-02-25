import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';

import { ImportService } from '../../../services/import.service';
import { FileService } from '../../../services/file.service';

@Component({
  selector: 'app-insert',
  templateUrl: './insert.component.html',
  styleUrls: ['./insert.component.scss'],
  providers: [FileService]
})
export class FileInsertComponent implements OnInit {

	fichier: any;
	fields: any[] = [];

  constructor(
  	private importS: ImportService,
    private route: ActivatedRoute,
    private router: Router,
    public fileS: FileService
  ) { }

  ngOnInit() {
  	this.fileS.file.subscribe(fichier=>this.fichier = fichier);
    this.fileS.mappedFields
                  .pipe(
                    map(fields => {
                      //filtre des champs qui ne sont pas intégrable dans la synthèse
                      return fields.filter(field => field.fieldFSD.exportLib !== null);
                    })
                  ).subscribe(fields=>this.fields = fields);
  }
}
