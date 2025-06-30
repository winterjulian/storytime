import {Component, inject, input, OnInit, output} from '@angular/core';
import {UserStep} from '../../interfaces/user-step';
import {UserJourney} from '../../interfaces/user-journey';
import {DragDropService} from '../../services/drag-drop.service';

@Component({
  selector: 'app-user-step-element',
  imports: [],
  templateUrl: './user-step-element.html',
  styleUrl: './user-step-element.scss',
})
export class UserStepElement implements OnInit {
  public dragDropService = inject(DragDropService);

  public userStep = input.required<UserStep>();
  public userJourney = input.required<UserJourney>();
  public dropZones = this.dragDropService.connectedDropZones;
  public delete = output<void>();

  public dropZoneId = '';

  ngOnInit() {
    this.dropZoneId =
      'drop-' + this.userJourney().id + '-' + this.userStep().id;
    this.dragDropService.registerDropZone(this.dropZoneId);
    this.dragDropService.registerContainer(
      this.dropZoneId,
      this.userStep().issues,
    );
  }
}
