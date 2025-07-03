import {Component, inject, input, OnInit} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {UserStep} from '../../interfaces/user-step';
import {DragDropService} from '../../services/drag-drop.service';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {IssueElement} from '../issue-element/issue-element';
import {StepIssue} from '../../interfaces/step-issue';
import {StoreService} from '../../services/store.service';
import {DropEventData} from '../../interfaces/drop-event-data';

@Component({
  selector: 'app-issue-list-wrapper',
  imports: [
    CdkDropList,
    IssueElement
  ],
  standalone: true,
  templateUrl: './issue-list-wrapper.html',
  styleUrl: './issue-list-wrapper.scss'
})
export class IssueListWrapper implements OnInit {
  // TODO: Rename => IssueWrapper / IssueDropZoneWrapper?
  public dragDropService = inject(DragDropService);
  public store = inject(StoreService);
  public userJourney = input.required<UserJourney>();
  public userStep = input.required<UserStep>();

  public dropZones = this.dragDropService.connectedDropZones;
  public dropZoneId = '';

  ngOnInit() {
    this.dropZoneId =
      'drop-' + this.userJourney().id + '-' + this.userStep().id;
    this.dragDropService.registerDropZone(this.dropZoneId); // to have the zone as drop zone available globally
    this.dragDropService.registerContainer(
      this.dropZoneId,
      this.userStep().issues,
    ); // to allow history (undo, redo)
  }

  public onExecuteDrop(event: CdkDragDrop<DropEventData>) {
    this.dragDropService.executeDropCommand(event);
    // const issue: StepIssue = event.item.data;
    // this.store.saveIssueInStep(event, issue, this.userStep().id)
  }
}
