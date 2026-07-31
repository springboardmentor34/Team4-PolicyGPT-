import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { eligibilityGuard } from './eligibility-guard';

describe('eligibilityGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => eligibilityGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
