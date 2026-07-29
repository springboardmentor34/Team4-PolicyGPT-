import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Researcher } from './researcher';

describe('Researcher', () => {
  let component: Researcher;
  let fixture: ComponentFixture<Researcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Researcher],
    }).compileComponents();

    fixture = TestBed.createComponent(Researcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
