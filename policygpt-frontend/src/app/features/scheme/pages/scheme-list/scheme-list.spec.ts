import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeList } from './scheme-list';

describe('SchemeList', () => {
  let component: SchemeList;
  let fixture: ComponentFixture<SchemeList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeList],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemeList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
