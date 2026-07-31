import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedSchemes } from './recommended-schemes';

describe('RecommendedSchemes', () => {
  let component: RecommendedSchemes;
  let fixture: ComponentFixture<RecommendedSchemes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecommendedSchemes],
    }).compileComponents();

    fixture = TestBed.createComponent(RecommendedSchemes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
