import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageStatistics } from './usage-statistics';

describe('UsageStatistics', () => {
  let component: UsageStatistics;
  let fixture: ComponentFixture<UsageStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(UsageStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
