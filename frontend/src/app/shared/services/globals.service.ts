import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class GlobalsService {

	protected title: BehaviorSubject<string> = new BehaviorSubject<string>('Apps du Gretia');
  protected navbarColor: BehaviorSubject<string> = new BehaviorSubject<string>('#673ab7');
	protected sidenav: BehaviorSubject<Array<any>> = new BehaviorSubject<Array<any>>([{title: 'Accueil', url: '/', img: 'home', tooltip: 'Accueil'}]);

  constructor() {}

  public setTitle(title: string) {
    this.title.next(title);
  }

  public getTitle() {
    return this.title.value;
  }

  public setNavbarColor(color: string) {
    this.navbarColor.next(color);
  }

  public getNavbarColor() {
    return this.navbarColor.value;
  }

  public setSidenav(sidenav: Array<any>) {
    this.sidenav.next(sidenav);
  }

  public getSidenav() {
    return this.sidenav.value;
  }

  public addSidenav(element: any) {
  	let sidenav = this.sidenav.value;
  	sidenav.push(element);
    this.sidenav.next(sidenav);
  }

  searchInObject(searchterm: string, object: Object, keys: Array<string>): boolean {
    //vérification de la chaine non vide
    if (!searchterm.trim().length) return true;

    let terms: Array<string> = (searchterm.trim()).split(' ');
    let isInObject: number = 0;

    terms.forEach(function(term) {
      keys.forEach(function(key) {
        if (String(object[key]).toLowerCase().indexOf(term.toLowerCase()) !== -1) {
          isInObject += 1;
          return;  
        }
      });

    });

    return isInObject == terms.length;
  }
}
