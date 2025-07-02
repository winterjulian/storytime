import {Component, input} from '@angular/core';
import {StepIssue} from '../../interfaces/step-issue';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-issue-element',
  imports: [CdkDrag],
  standalone: true,
  templateUrl: './issue-element.html',
  styleUrl: './issue-element.scss',
})
export class IssueElement {
  issue = input.required<StepIssue>();
}
