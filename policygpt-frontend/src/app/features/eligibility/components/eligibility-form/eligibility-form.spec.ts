import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityForm } from './eligibility-form';

describe('EligibilityForm', () => {
  let component: EligibilityForm;
  let fixture: ComponentFixture<EligibilityForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EligibilityForm],
    }).compileComponents();

    fixture = TestBed.createComponent(EligibilityForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
