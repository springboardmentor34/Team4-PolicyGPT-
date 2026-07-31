import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationGuidance } from './application-guidance';

describe('ApplicationGuidance', () => {
  let component: ApplicationGuidance;
  let fixture: ComponentFixture<ApplicationGuidance>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationGuidance],
    }).compileComponents();

    fixture = TestBed.createComponent(ApplicationGuidance);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
