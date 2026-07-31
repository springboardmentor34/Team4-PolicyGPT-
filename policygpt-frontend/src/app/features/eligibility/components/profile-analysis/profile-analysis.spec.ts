import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAnalysis } from './profile-analysis';

describe('ProfileAnalysis', () => {
  let component: ProfileAnalysis;
  let fixture: ComponentFixture<ProfileAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileAnalysis],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
