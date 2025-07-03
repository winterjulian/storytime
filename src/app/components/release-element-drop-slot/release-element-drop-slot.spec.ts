import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseElementDropSlot } from './release-element-drop-slot';

describe('ReleaseElementDropSlot', () => {
  let component: ReleaseElementDropSlot;
  let fixture: ComponentFixture<ReleaseElementDropSlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseElementDropSlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseElementDropSlot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
