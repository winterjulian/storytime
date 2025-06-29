import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStoryController } from './user-story-controller';

describe('UserStoryController', () => {
  let component: UserStoryController;
  let fixture: ComponentFixture<UserStoryController>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserStoryController]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserStoryController);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
