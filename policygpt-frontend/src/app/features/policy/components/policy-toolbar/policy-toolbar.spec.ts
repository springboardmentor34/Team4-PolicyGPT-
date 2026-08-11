import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyToolbar } from './policy-toolbar';

describe('PolicyToolbar', () => {
  let component: PolicyToolbar;
  let fixture: ComponentFixture<PolicyToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
