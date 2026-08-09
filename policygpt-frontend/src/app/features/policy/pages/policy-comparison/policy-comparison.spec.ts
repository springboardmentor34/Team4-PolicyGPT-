import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyComparison } from './policy-comparison';

describe('PolicyComparison', () => {
  let component: PolicyComparison;
  let fixture: ComponentFixture<PolicyComparison>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyComparison],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyComparison);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
