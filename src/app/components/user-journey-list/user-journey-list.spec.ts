import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJourneyList } from './user-journey-list';

describe('UserJourneyList', () => {
  let component: UserJourneyList;
  let fixture: ComponentFixture<UserJourneyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJourneyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJourneyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
