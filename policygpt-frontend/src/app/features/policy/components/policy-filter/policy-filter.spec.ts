import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyFilter } from './policy-filter';

describe('PolicyFilter', () => {
  let component: PolicyFilter;
  let fixture: ComponentFixture<PolicyFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
