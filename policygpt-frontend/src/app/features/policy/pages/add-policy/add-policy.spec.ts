import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPolicy } from './add-policy';

describe('AddPolicy', () => {
  let component: AddPolicy;
  let fixture: ComponentFixture<AddPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPolicy],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPolicy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
