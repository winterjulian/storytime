import {Component, inject, input, OnInit} from '@angular/core';
import {UserStep} from '../../interfaces/user-step';
import {DragDropService} from '../../services/drag-drop.service';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {IssueElement} from '../issue-element/issue-element';
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
  // TODO: Rename: IssueWrapper / IssueDropZoneWrapper?
  public dragDropService = inject(DragDropService);
  public store = inject(StoreService);
  public userStep = input.required<UserStep>();

  public dropZones = this.dragDropService.connectedDropZones;
  public dropZoneId = '';

  ngOnInit() {
    this.dropZoneId =
      'drop-' + this.userStep().journeyId + '-' + this.userStep().id;
    this.dragDropService.registerDropZone(this.dropZoneId);
    this.store.registerContainerReference(
      this.dropZoneId,
      this.userStep().issues,
    ); // to allow history (undo, redo)
  }

  public onExecuteDrop(event: CdkDragDrop<DropEventData>) {
    this.dragDropService.executeDropCommand(event);
  }
}
