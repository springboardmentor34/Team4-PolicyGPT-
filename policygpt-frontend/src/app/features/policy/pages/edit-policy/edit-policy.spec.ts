import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPolicy } from './edit-policy';

describe('EditPolicy', () => {
  let component: EditPolicy;
  let fixture: ComponentFixture<EditPolicy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPolicy],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPolicy);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
