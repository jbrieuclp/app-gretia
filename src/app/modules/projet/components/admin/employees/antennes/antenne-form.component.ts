import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";

import { AntenneService } from './antenne.service';

@Component({
  selector: 'app-projet-salarie-antenne-form',
  templateUrl: './antenne-form.component.html'
})
export class AntenneFormComponent implements OnInit {

	public form: FormGroup;
  isEdit(): boolean {
    return this.antenneS.antenne.getValue() !== null;
  }

  constructor(
  	private antenneS: AntenneService,
  ) { }

  ngOnInit() {
  	this.form = this.antenneS.form;
  }

  save() {
  	this.antenneS.submit();
  }

  cancel() {
    if (this.antenneS.antenne.getValue()) {
      this.antenneS.antennes.push(this.antenneS.antenne.getValue());
    }
    this.antenneS.reset();
  }
}
