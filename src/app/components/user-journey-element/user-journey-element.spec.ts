import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJourneyElement } from './user-journey-element';

describe('UserJourneyElement', () => {
  let component: UserJourneyElement;
  let fixture: ComponentFixture<UserJourneyElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJourneyElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJourneyElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
