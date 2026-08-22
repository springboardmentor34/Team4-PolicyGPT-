import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AdminService } from '../../../core/services/admin.service';
import { Admin } from './admin';

describe('Admin', () => {
  let component: Admin;
  let fixture: ComponentFixture<Admin>;

  beforeEach(async () => {
    const adminServiceMock = {
      getDashboard: () =>
        of({
          adminName: 'System Administrator',
          totalUsers: 0,
          totalPolicies: 0,
          totalReports: 0,
          auditLogs: 0,
          userGrowth: '+0.0%',
          policyGrowth: '+0.0%',
          reportStatus: 'No reports',
          auditStatus: 'No activity',
          users: [],
          policies: [],
          analytics: [],
          reports: [],
          auditLogList: [],
        }),
    };

    await TestBed.configureTestingModule({
      imports: [Admin],
      providers: [{ provide: AdminService, useValue: adminServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(Admin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
