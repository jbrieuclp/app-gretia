import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { tap, map } from 'rxjs/operators';
import * as moment from 'moment';

import { SuiveuseService } from '../suiveuse.service';
import { AuthService } from '@shared/auth/authentication.service';
import { WorksRepository } from '@projet/repository/works.repository';
import { Work, Recup } from '@projet/repository/project.interface';
import { WorkingTimeResultsService } from '../result/results.service';

@Component({
  selector: 'app-project-works-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class WoksFiltersComponent implements OnInit {

  public form: FormGroup;
  searching: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private worksR: WorksRepository,
    private workingTimeResultsS: WorkingTimeResultsService,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      action: [null],
      study: [null],
      category: [null],
      'workingDate[after]': [null],
      'workingDate[before]': [null],
      detail: [null],
    });
  }

  search() {
    this.searching = true
    this.workingTimeResultsS.getResults(this.getParams())
      .subscribe(() => this.searching = false);
  }

  getParams() {
    let params = {
      'compteId': this.authService.getUser().getValue().id
    };
    for (const [key, value] of Object.entries(this.form.value)) {
      if (value !== null) {
        if (key.match(/workingDate.*/)) {
          params[key] = moment(value).format('YYYY-MM-DD');
        } else {
          params[key] = value;
        }
      }
    }

    return params;
  }

  reset() {
    this.form.reset();
  }

}
