import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, combineLatest, Observable, forkJoin } from 'rxjs';
import { tap, map, startWith, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import 'moment/locale/fr'  // without this line it didn't work

import { AuthService } from '@shared/auth/authentication.service';
import { GlobalsService } from '../../../../../../shared/services/globals.service';
import { Holiday, RefDay } from '../../../../repository/project.interface';
import { ProjectsRepository } from '../../../../repository/projects.repository';
import { SuiveuseService } from '../../suiveuse.service';
import { WorkingTimeResultsService } from '../../result/results.service';
import { WorksRepository } from '../../../../repository/works.repository';

const DEFAULT_DURATION = 300;

interface HOLIDAY_FORM {day: RefDay, form: FormGroup; holiday?: Holiday};

@Component({
  selector: 'app-projet-holiday-form',
  templateUrl: './holiday-form.dialog.html',
  styleUrls: ['./holiday-form.dialog.scss']
})
export class HolidayFormDialog implements OnInit, OnDestroy {

  holidayForms: HOLIDAY_FORM[] = [];
  holidays: Holiday[] = [];
  loading: boolean = false;
  saving: boolean = false;
  subscription: Subscription;

  startDateForm: FormControl = new FormControl();
  endDateForm: FormControl = new FormControl();

  get accumulatedDays(): number {
    return this.holidayForms.map((f: any): number => {
        if (f.form.enable) {
          return (f.form.get('morning').value ? 0.5 : 0) + (f.form.get('evening').value ? 0.5 : 0);
        }
        return 0;
      })
     .reduce((a, b) => a+b, 0);
  }

  constructor(
    public dialogRef: MatDialogRef<HolidayFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private globalS: GlobalsService,
    private projectsR: ProjectsRepository,
    private worksR: WorksRepository,
    private suiveuseS: SuiveuseService,
    private workingTimeResultsS: WorkingTimeResultsService,
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.subscription = combineLatest(
      this.startDateForm.valueChanges
        .pipe(
          filter((value) => value !== null)
        ),
      this.endDateForm.valueChanges
        .pipe(
          filter((value) => value !== null)
        )
    )
      .pipe(
        switchMap(([start, end]) => {
          return forkJoin(
            this.getDays(start, end),
            this.getHolidays(start, end)
          );
        }),
        tap(([days, holidays]: [RefDay[], Holiday[]]) => this.holidays = holidays),
        map(([days, holidays]: [RefDay[], Holiday[]]): HOLIDAY_FORM[] => {
          return days.map(day => { 
            return {
              day: day,
              form: this.getForm(day.date), 
              holiday: holidays.find(h => moment(h.holidayDate).isSame(day.date, 'day'))
            }; 
          })
        }),
        tap((holidayForms: HOLIDAY_FORM[]) => {
          holidayForms.forEach(hf => {
            console.log(hf);
            this.patchForm(hf);
          })
        })
      )
      .subscribe((holidayForms: HOLIDAY_FORM[]) => this.holidayForms = holidayForms)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getDays(start, end): Observable<RefDay[]> {
    this.loading = true;

    return this.projectsR.refDays({
      'date[after]': moment(start).format('YYYY-MM-DD'),
      'date[before]': moment(end).format('YYYY-MM-DD'),
    })
      .pipe(
        tap(() => this.loading = false),
        map((data: any): RefDay[] => data["hydra:member"]),
      )
  }

  private getHolidays(start, end): Observable<Holiday[]> {
   
    const params = {
      compteId: this.authService.getUser().getValue().id,
      'holidayDate[after]': moment(start).format('YYYY-MM-DD'),
      'holidayDate[before]': moment(end).format('YYYY-MM-DD'),
    }

    return this.worksR.holidays(params)
      .pipe(
        map((data: any): Holiday[] => data["hydra:member"]),
      );
  } 

  private getForm(date): FormGroup {
    return this.fb.group({
      holidayDate: [date, [Validators.required]],
      morning: [null, [Validators.required]],
      evening: [null, [Validators.required]],
    });
  }

  private patchForm(hf: HOLIDAY_FORM) {
    (hf.day.notWorked || hf.day.weekend) ? hf.form.disable() : hf.form.enable();
    hf.form.get('morning').setValue(hf.holiday ? hf.holiday.morning : !(hf.day.notWorked || hf.day.weekend));
    hf.form.get('evening').setValue(hf.holiday ? hf.holiday.evening : !(hf.day.notWorked || hf.day.weekend));
  }

  displayDate(date) {
    return moment(date).format('dddd DD/MM/YYYY');
  }

  submit() {
    this.saving = true;

    this.holidayForms.filter(hf => hf.form.enabled)
      .forEach(hf => {
        this.save(hf);
      });
    this.saving = false;
    this.close();
  }

  private save(hf: HOLIDAY_FORM) {
    let data = Object.assign((hf.holiday !== undefined ? hf.holiday : {}), hf.form.value);

    let api = (data['@id'] ? this.worksR.patch(data['@id'], data) : this.worksR.postMyHolidays(data));
    api.subscribe((holiday) => this.suiveuseS.refreshDayData(holiday.holidayDate));
  }

  close() {
    this.dialogRef.close();
  }

}
