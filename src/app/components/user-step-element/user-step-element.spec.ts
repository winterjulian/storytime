import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStepElement } from './user-step-element';

describe('UserStepElement', () => {
  let component: UserStepElement;
  let fixture: ComponentFixture<UserStepElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStepElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStepElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
