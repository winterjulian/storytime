import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleasePage } from './release-page';

describe('ReleasePage', () => {
  let component: ReleasePage;
  let fixture: ComponentFixture<ReleasePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleasePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
