import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { tap } from 'rxjs/operators';

import { GlobalsService } from '../../../../../../../shared';
import { EmployeeService } from './employee.service';
import { PersonService } from '../person.service';

@Component({
  selector: 'app-projet-person-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {

	form: FormGroup;
  isEdit(): boolean {
    return this.employeeS.employee.getValue() !== null;
  }

  @Output() refreshPerson = new EventEmitter<any>();

  constructor(
    private employeeS: EmployeeService,
    private personS: PersonService,
    private globalsS: GlobalsService,
  ) { }

  ngOnInit() {
    this.form = this.employeeS.form;

    this.employeeS.person = this.personS.person.getValue();
  }

  save() {
    this.employeeS.submit()
      .pipe(
        tap(() => this.globalsS.snackBar({msg: "Enregistrement effectué"}))
      )
      .subscribe(
        () => this.refreshPerson.emit(),
        (err) => {
          let msg = err.error.violations.map(v => v.message);
          this.globalsS.snackBar({msg: msg.join("\n"), color: 'red', duration: null});
        }
      );
  }

  cancel() {
    this.employeeS.reset();
    this.employeeS.moveStepper(0);
  }
}
