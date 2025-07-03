import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseElement } from './release-element';

describe('ReleaseElement', () => {
  let component: ReleaseElement;
  let fixture: ComponentFixture<ReleaseElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
