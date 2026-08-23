import { TestBed } from '@angular/core/testing';

import { UsageStatistics } from './usage-statistics';

describe('UsageStatistics', () => {
  let service: UsageStatistics;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsageStatistics);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
