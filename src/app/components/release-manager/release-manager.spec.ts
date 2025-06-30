import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseManager } from './release-manager';

describe('ReleaseManager', () => {
  let component: ReleaseManager;
  let fixture: ComponentFixture<ReleaseManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseManager],
    }).compileComponents();

    fixture = TestBed.createComponent(ReleaseManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
