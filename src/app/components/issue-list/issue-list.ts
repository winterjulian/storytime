import {Component, effect, inject, signal} from '@angular/core';
import {IssueElement} from '../issue-element/issue-element';
import {StepIssue} from '../../interfaces/step-issue';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {DragDropService} from '../../services/drag-drop.service';
import {StoreService} from '../../services/store.service';
import {DropEventData} from '../../interfaces/drop-event-data';

@Component({
  selector: 'app-issue-list',
  imports: [IssueElement, CdkDropList],
  standalone: true,
  templateUrl: './issue-list.html',
  styleUrl: './issue-list.scss',
})
export class IssueList {
  public dragDropService = inject(DragDropService);
  public store = inject(StoreService);
  public issues = signal<Array<StepIssue>>([]);
  public dropZones = this.dragDropService.connectedDropZones;

  constructor() {
    effect(() => {
      // to make sure registration is done only after data was loaded!
      const currentIssues = this.store.gitlabIssues();
      if (currentIssues.length > 0) {
        this.issues.set(currentIssues);
        this.store.registerContainerReference('issue-source', currentIssues);
      }
    });
  }

  public onExecuteDrop(event: CdkDragDrop<DropEventData>) {
    this.dragDropService.executeDropCommand(event);
  }
}
