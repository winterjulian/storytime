import {Component, effect, inject, signal} from '@angular/core';
import {IssueElement} from '../issue-element/issue-element';
import {StepIssue} from '../../interfaces/step-issue';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {DragDropService} from '../../services/drag-drop.service';
import {StoreService} from '../../services/store.service';
import {DbStepIssue} from '../../services/models/db-step-issue.model';

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
        console.log('registerContainer-x');
        this.dragDropService.registerContainer('issue-source', currentIssues);
      }
    });
  }

  // ngOnInit() {
  //   this.issues.set(this.issueService.getIssues());
  //   this.dragDropService.registerContainer('issue-source', this.issues());
  // }

  public onExecuteDrop(event: CdkDragDrop<StepIssue[]>) {
    this.dragDropService.executeDropCommand(event);
    const issue: DbStepIssue = event.item.data;
    // this.store.deleteIssueFromStep(issue);
  }
}
