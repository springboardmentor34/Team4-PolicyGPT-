import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAnalytics } from './department-analytics';

describe('DepartmentAnalytics', () => {
  let component: DepartmentAnalytics;
  let fixture: ComponentFixture<DepartmentAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentAnalytics],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentAnalytics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
