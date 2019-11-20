import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ImportService } from '../../../services/import.service';

@Component({
  selector: 'app-import-file-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class FileDashboardComponent implements OnInit {

	fichier: any;

  constructor(
  	private route: ActivatedRoute,
  	private importS: ImportService
  ) { }

  ngOnInit() {
  	let id_fichier = this.route.snapshot.paramMap.get('fichier');

    if ( id_fichier !== null && Number.isInteger(Number(id_fichier)) ) {
    	this.getFichier(Number(id_fichier));
    }
  }

  getFichier(id) {
  	this.importS.getFichier(id)
          .subscribe(
            (fichier: any) => this.fichier = fichier,
            error => { /*this.errors = error.error;*/ }
          );
  }
}
