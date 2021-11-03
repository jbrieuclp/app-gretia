import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Observable } from 'rxjs';

import { PersonRepository } from '../../../repository/person.repository';
import { Person } from '../../../repository/project.interface';

@Component({
  selector: 'app-projet-travailleur-form',
  templateUrl: './travailleur-form.component.html',
  styleUrls: ['./travailleur-form.component.css']
})
export class TravailleurFormComponent implements OnInit {

	@Input('travailleurForm')
	travailleurForm: FormGroup;
	persons: Observable<Person[]>;

  constructor( private personR: PersonRepository ) {}

  ngOnInit() {
  	this.persons = this.personR.personnes();
  }

}
