import { Component } from '@angular/core';

//services
import { LayoutService } from '../../shared/layout/layout.service';

const layout = {title: 'Suivis Études',
                sidenav: [
                  {title: 'Accueil', url: '/', img: 'home', tooltip: 'Accueil'},
                  {title: 'Plan de charge', url: '/projet/plan-de-charges', img: 'fact_check', tooltip: 'Plan de charge'},
                  {title: 'Projets', url: '/projet/projets', img: 'folder', tooltip: 'Liste des études'},
                  {title: 'Suiveuse', url: '/projet/suiveuse', img: 'today', tooltip: 'Remplir la suiveuse'},
                  {title: 'Conventions', url: '/projet/conventions', img: 'assessment', tooltip: 'Consulter les conventions'},
                  {title: 'Administration', url: '/projet/admin', img: 'build', tooltip: 'Administration', role: 'ROLE_PROJET_ADMIN'}
                ]};

@Component({
  selector: 'app-projet-init',
  template: '<div class="container-fluid"><router-outlet></router-outlet></div>'
})
export class ProjetInitComponent {

  constructor(private layoutService: LayoutService) { 
    this.layoutService.setLayout(layout);
  }

}
