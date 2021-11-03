import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { distinctUntilChanged, switchMap, map, tap } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../suiveuse.service';
import { WorksRepository } from '../../../repository/works.repository'
import { Work } from '../../../repository/project.interface'

@Injectable()
export class WorkService {

	works: Work[] = [];
  loading: boolean = false;

  constructor(
  	private suiveuseS: SuiveuseService,
  	private worksR: WorksRepository,
  ) { 
  	this.setObservables();
  }

  setObservables() {
  	this.suiveuseS.selectedDate.asObservable()
  		.pipe(
  			distinctUntilChanged(),
  			switchMap((date: Date) => this.getWorks({
                  "workingDate": moment(date).format('yyyy-MM-DD')
                })),
  		)
  		.subscribe((works: Work[]) => this.works = works);
  }

  getWorks(params): Observable<Work[]> {
    this.loading = true;
     return this.worksR.myWorks(params)
        .pipe(
          tap(() => this.loading = false),
          map((data: any): Work[] => data["hydra:member"])
        );
  }

  refreshWorks(date) {
  	this.getWorks({"workingDate": moment(date).format('yyyy-MM-DD')})
  		.subscribe((works: Work[]) => this.works = works);
  }

}
