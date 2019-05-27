import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {

	outils : any;

  constructor() { }

  ngOnInit() {
  	this.outils = [
  		{
  	  	title: 'Visualisation'		,
  	  	text: '<p>Outil de consultation cartographique des données du GRETIA.</p>',
  	  	image: '/assets/images/carte.png',
  	  	url: 'http://outils.gretia.org/carte/visualisation/',
        target: "_blank"
  	  },
      {
        title: 'Saisie'    ,
        text: '<p>Outil de saisie et de consultation des données du GRETIA.</p>',
        image: '/assets/images/app.png',
        url: 'http://outils.gretia.org/geonature/',
        target: "_blank"
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
  	  	text: '<p>Outil de consultation des études et des lots de données intégrées dans la BDD.</p><p>Outil de depot de jeux de données à intégrer.</p>',
  	  	image: '/assets/images/app.png',
  	  	url: 'http://outils.gretia.org/geonature/#/metadata',
        target: "_self"
  	  },
  	  {
  	  	title: 'Import'		,
  	  	text: '<p>Outil de correction de fichier de données en vue d\'être intégré en BDD.</p>',
  	  	image: '/assets/images/import.png',
  	  	url: 'http://outils.gretia.org/import/',
        target: "_blank"
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