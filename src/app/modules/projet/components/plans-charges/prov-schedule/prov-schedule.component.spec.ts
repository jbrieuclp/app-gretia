import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvScheduleComponent } from './prov-schedule.component';

describe('ProvScheduleComponent', () => {
  let component: ProvScheduleComponent;
  let fixture: ComponentFixture<ProvScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
