import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragDropExample } from './drag-drop-example';

describe('DragDropExample', () => {
  let component: DragDropExample;
  let fixture: ComponentFixture<DragDropExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragDropExample],
    }).compileComponents();

    fixture = TestBed.createComponent(DragDropExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
