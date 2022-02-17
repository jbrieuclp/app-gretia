import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { filter, map, tap, finalize } from "rxjs/operators";

import { SynologyRepository } from '@synology/synology.repository';
import { SynologyService} from '@synology/synology.service';

@Component({
  selector: 'app-synology-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.scss']
})
export class ConnectComponent implements OnInit {

  public form: FormGroup;
  public saveForm: FormControl = new FormControl(false);
  public connecting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private synologyR: SynologyRepository,
    private synologyS: SynologyService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
    //FORM
    this.form = this.fb.group({
      login: [null, [Validators.required]],
      pwd: [null, [Validators.required]],
    });

    if (localStorage.getItem('nas_syno_connect') !== null) {
      let ID = JSON.parse(localStorage.getItem('nas_syno_connect'));
      ID.pwd = atob(ID.pwd);
      this.form.patchValue(ID);
      this.saveForm.setValue(true);
    }
  }

  connect() {
    this.connecting = true;
    this.synologyR.connect(this.form.value)
      .pipe(
        tap(() => this.connecting = false),
        filter((res) => res.success === true),
        map((res) => res.data.sid),
        tap((sid) => this.synologyS.sid = sid),
        finalize(() => {
          this.saveLoginForm(this.form.value);
          this.synologyS.user = this.form.get('login').value;
          this.form.reset();
        })
      )
      .subscribe((sid) => this.synologyS.sid = sid);
  }

  private saveLoginForm(formValue) {
    if (this.saveForm.value) {
      const ID = JSON.stringify({login: this.form.get('login').value, pwd: btoa(this.form.get('pwd').value)});
      localStorage.setItem('nas_syno_connect', ID);
    } else {
      localStorage.removeItem('nas_syno_connect');
    }
  }
}
