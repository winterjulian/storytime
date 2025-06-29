import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJourneyCreateElement } from './user-journey-create-element';

describe('UserJourneyCreateElement', () => {
  let component: UserJourneyCreateElement;
  let fixture: ComponentFixture<UserJourneyCreateElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJourneyCreateElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJourneyCreateElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
