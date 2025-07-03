import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {StoreService} from '../../services/store.service';
import {DragDropService} from '../../services/drag-drop.service';
import {UserJourney} from '../../interfaces/user-journey';
import {UserStep} from '../../interfaces/user-step';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {DropEventData} from '../../interfaces/drop-event-data';
import {StepIssue} from '../../interfaces/step-issue';
import {IssueElement} from '../issue-element/issue-element';

@Component({
  selector: 'app-release-element-drop-slot',
  imports: [
    CdkDropList,
    IssueElement
  ],
  standalone: true,
  templateUrl: './release-element-drop-slot.html',
  styleUrl: './release-element-drop-slot.scss'
})
export class ReleaseElementDropSlot implements OnInit, OnDestroy {
  journey = input.required<UserJourney>();
  userStep = input.required<UserStep>();
  releaseId = input.required<string>();
  temporaryIssues: Array<StepIssue> = [];

  public store = inject(StoreService);
  public dragDropService = inject(DragDropService);
  public dropZoneId = '';
  public dropZones = this.dragDropService.connectedDropZones;

  ngOnInit() {
    this.dropZoneId = 'release-' + this.releaseId() + '-' + this.userStep().id;
    this.dragDropService.registerDropZone(this.dropZoneId)
    this.store.registerContainerReference(this.dropZoneId, this.temporaryIssues);
  }

  ngOnDestroy() {
    // TODO: deregister dropZoneId;
    this.store.removeContainerMapReferencesByStep(this.userStep(), this.releaseId())
  }

  onExecuteDrop(event: CdkDragDrop<DropEventData>) {
    this.dragDropService.executeDropCommand(event);
  }
}
