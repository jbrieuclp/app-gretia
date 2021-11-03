import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { PersonRepository } from '../../../repository/person.repository';
import { Person } from '../../../repository/project.interface';

@Component({
  selector: 'app-s-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class SListUserComponent implements OnInit {

	persons: Observable<Person[]>;

  constructor(private personR: PersonRepository) { }

  ngOnInit() {
  	this.persons = this.personR.personnes();
  }

}
