import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { SuiveuseService } from '../../suiveuse.service';

@Component({
  selector: '[app-projet-suiveuse-calendar-day]',
  templateUrl: './day.component.html',
  styleUrls: ['./day.component.scss']
})
export class CalendarDayComponent implements OnInit, OnDestroy {

  @Input() date;
  work: any;
  today: Date = moment().toDate();
  get selectedDate() { return this.suiveuseS.selectedDate; }
  $sub: Subscription;

  constructor(
    private suiveuseS: SuiveuseService,
  ) { }

  ngOnInit() {
    this.$sub = this.suiveuseS.$dateWorkTime.asObservable()
      .pipe(
        map(works => works.find(w => moment(w.date).isSame(moment(this.date), 'day')))
      )
      .subscribe(work => this.work = work);
  }

  displayTime(duration) {
    return duration !== null ? Math.trunc(duration/60) + "h" + (duration%60 !== 0 ? duration%60 :'') : "-";
  }

  ngOnDestroy() {
    this.$sub.unsubscribe();
  }

}
