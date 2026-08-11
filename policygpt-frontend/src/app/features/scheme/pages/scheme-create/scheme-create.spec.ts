import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeCreate } from './scheme-create';

describe('SchemeCreate', () => {
  let component: SchemeCreate;
  let fixture: ComponentFixture<SchemeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchemeCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(SchemeCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
