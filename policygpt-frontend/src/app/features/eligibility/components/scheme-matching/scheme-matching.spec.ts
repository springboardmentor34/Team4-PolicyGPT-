import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeMatching } from './scheme-matching';

describe('SchemeMatching', () => {
  let component: SchemeMatching;
  let fixture: ComponentFixture<SchemeMatching>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeMatching],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemeMatching);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
