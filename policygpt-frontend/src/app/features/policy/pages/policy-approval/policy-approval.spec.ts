import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyApproval } from './policy-approval';

describe('PolicyApproval', () => {
  let component: PolicyApproval;
  let fixture: ComponentFixture<PolicyApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyApproval],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyApproval);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
