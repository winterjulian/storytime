import { Component, input } from '@angular/core';
import { Issue } from '../../interfaces/issue';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-issue-element',
  imports: [CdkDrag],
  standalone: true,
  templateUrl: './issue-element.html',
  styleUrl: './issue-element.scss',
})
export class IssueElement {
  issue = input.required<Issue>();
}
