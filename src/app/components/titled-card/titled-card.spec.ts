import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitledCard } from './titled-card';

describe('TitledCard', () => {
  let component: TitledCard;
  let fixture: ComponentFixture<TitledCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitledCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitledCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
