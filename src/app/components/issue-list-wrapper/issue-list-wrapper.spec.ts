import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueListWrapper } from './issue-list-wrapper';

describe('IssueListWrapper', () => {
  let component: IssueListWrapper;
  let fixture: ComponentFixture<IssueListWrapper>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IssueListWrapper]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueListWrapper);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
