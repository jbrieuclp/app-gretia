import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulSuiveusesComponent } from './cumul-suiveuses.component';

describe('CumulSuiveusesComponent', () => {
  let component: CumulSuiveusesComponent;
  let fixture: ComponentFixture<CumulSuiveusesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CumulSuiveusesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CumulSuiveusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
