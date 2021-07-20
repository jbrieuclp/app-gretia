import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfundedTasksComponent } from './unfunded-tasks.component';

describe('UnfundedTasksComponent', () => {
  let component: UnfundedTasksComponent;
  let fixture: ComponentFixture<UnfundedTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnfundedTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfundedTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
