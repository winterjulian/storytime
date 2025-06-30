import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStepCreateElement } from './user-step-create-element';

describe('UserStepCreateElement', () => {
  let component: UserStepCreateElement;
  let fixture: ComponentFixture<UserStepCreateElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStepCreateElement],
    }).compileComponents();

    fixture = TestBed.createComponent(UserStepCreateElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
