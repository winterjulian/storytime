import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStepElementCreate } from './user-step-element-create';

describe('UserStepElementCreate', () => {
  let component: UserStepElementCreate;
  let fixture: ComponentFixture<UserStepElementCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStepElementCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStepElementCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
