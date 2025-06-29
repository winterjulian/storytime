import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseRow } from './release-row';

describe('ReleaseRow', () => {
  let component: ReleaseRow;
  let fixture: ComponentFixture<ReleaseRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseRow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
