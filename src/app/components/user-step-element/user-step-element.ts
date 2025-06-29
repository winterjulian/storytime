import {Component, inject, input, OnInit} from '@angular/core';
import {UserStep} from '../../interfaces/user-step';
import {CdkDragDrop, CdkDropList} from '@angular/cdk/drag-drop';
import {UserJourney} from '../../interfaces/user-journey';
import {DragDropService} from '../../services/drag-drop.service';
import {Issue} from '../../interfaces/issue';
import {IssueElement} from '../issue-element/issue-element';

@Component({
  selector: 'app-user-step-element',
  imports: [
    CdkDropList,
    IssueElement
  ],
  templateUrl: './user-step-element.html',
  styleUrl: './user-step-element.scss'
})
export class UserStepElement implements OnInit {
  public dragDropService = inject(DragDropService)

  public userStep = input.required<UserStep>();
  public userJourney = input.required<UserJourney>();
  public dropZones = this.dragDropService.connectedDropZones;

  public dropZoneId  = ''

  ngOnInit() {
    this.dropZoneId = 'drop-' + this.userJourney().id + '-' + this.userStep().id;
    this.dragDropService.registerDropZone(this.dropZoneId);
    this.dragDropService.registerContainer(this.dropZoneId, this.userStep().issues);
  }

  onExecuteDrop(e: CdkDragDrop<Issue[]>) {
    this.dragDropService.executeDropCommand(e);
  }
}
