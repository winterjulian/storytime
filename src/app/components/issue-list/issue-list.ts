import { Component, inject, OnInit, signal } from '@angular/core';
import { IssueElement } from '../issue-element/issue-element';
import { Issue } from '../../interfaces/issue';
import { CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DragDropService } from '../../services/drag-drop.service';

@Component({
  selector: 'app-issue-list',
  imports: [IssueElement, CdkDropList],
  standalone: true,
  templateUrl: './issue-list.html',
  styleUrl: './issue-list.scss',
})
export class IssueList implements OnInit {
  public dragDropService = inject(DragDropService);
  public issues = signal<Array<Issue>>([
    { id: '12c3', description: 'Bla', title: 'Issue-123' },
    {
      id: '2cb2',
      description: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
      title: 'Issue-553',
    },
  ]);
  public dropZones = this.dragDropService.connectedDropZones;

  ngOnInit() {
    this.dragDropService.registerContainer('issue-source', this.issues());
  }

  public onExecuteDrop(event: CdkDragDrop<Issue[]>) {
    this.dragDropService.executeDropCommand(event);
  }
}
