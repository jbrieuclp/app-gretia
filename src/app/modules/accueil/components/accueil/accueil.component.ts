import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@shared/models/user.model';
import { AuthService } from '@shared/auth/authentication.service';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

	outils : any;
  user: Observable<User>;

  constructor(private authService: AuthService) { 
    this.user = this.authService.getUser().asObservable();
  }

  ngOnInit() {
  	this.outils = [
  		{
  	  	title: 'Visualisation'		,
  	  	text: '<p>Outil de consultation cartographique des données du GRETIA.</p>',
  	  	image: '/assets/images/carte.png',
  	  	url: '/carto',
        target: "_self"
  	  },
      {
        title: 'Saisie'    ,
        text: '<p>Outil de saisie et de consultation des données du GRETIA.</p>',
        image: '/assets/images/geonature.png',
        url: 'http://outils.gretia.org/geonature/',
        target: "_self"
      },
  	  {
  	  	title: 'Taxref'		,
  	  	text: '<p>Outil de consultation et de comparaison des données Taxref.</p>',
  	  	image: '/assets/images/taxref.png',
  	  	url: '/taxref',
        target: "_self"
  	  },
  	  {
  	  	title: 'Metadonnées'		,
  	  	text: '<p>Outil de consultation des études et des lots de données intégrées dans la BDD.</p>',
  	  	image: '/assets/images/metadata.png',
  	  	url: 'http://outils.gretia.org/geonature/#/metadata',
        target: "_self"
  	  },
  	  {
  	  	title: 'Import'		,
  	  	text: '<p>Outil de correction de fichier de données en vue d\'être intégré en BDD.</p>',
  	  	image: '/assets/images/import.png',
  	  	url: '/import',
        role: 'ROLE_IMPORT',
        target: "_self"
  	  },
  	  {
  	  	title: 'Bibliographie'		,
  	  	text: '<p>Outil de saisie et de consultation des références bibliographiques du GRETIA.</p>',
  	  	image: '/assets/images/biblio.png',
  	  	url: 'http://biblio.gretia.org',
        target: "_blank"
  	  }];

  }

}
