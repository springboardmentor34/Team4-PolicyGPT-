import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Official } from './official';

describe('Official', () => {
  let component: Official;
  let fixture: ComponentFixture<Official>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Official],
    }).compileComponents();

    fixture = TestBed.createComponent(Official);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
