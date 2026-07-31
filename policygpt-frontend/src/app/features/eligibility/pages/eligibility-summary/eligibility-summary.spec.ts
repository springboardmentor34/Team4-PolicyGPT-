import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilitySummary } from './eligibility-summary';

describe('EligibilitySummary', () => {
  let component: EligibilitySummary;
  let fixture: ComponentFixture<EligibilitySummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EligibilitySummary],
    }).compileComponents();

    fixture = TestBed.createComponent(EligibilitySummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
