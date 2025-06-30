import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserJourneyElementCreate } from './user-journey-element-create';

describe('UserJourneyElementCreate', () => {
  let component: UserJourneyElementCreate;
  let fixture: ComponentFixture<UserJourneyElementCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserJourneyElementCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserJourneyElementCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
