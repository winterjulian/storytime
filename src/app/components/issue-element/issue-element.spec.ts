import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueElement } from './issue-element';

describe('IssueInterface', () => {
  let component: IssueElement;
  let fixture: ComponentFixture<IssueElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueElement],
    }).compileComponents();

    fixture = TestBed.createComponent(IssueElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
