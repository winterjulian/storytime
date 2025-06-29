import {Component, inject} from '@angular/core';
import {DragDropService} from '../../services/drag-drop.service';
import {UserJourneyService} from '../../services/user-journey.service';

@Component({
  selector: 'app-user-story-controller',
  imports: [],
  templateUrl: './user-story-controller.html',
  styleUrl: './user-story-controller.scss'
})
export class UserStoryController {
  public dragDropService = inject(DragDropService);
  public userJourneyService = inject(UserJourneyService);
  undo(): void {
    this.dragDropService.undo();
  }

  redo(): void {
    this.dragDropService.redo();
  }

  addUserJourney(): void {
    console.log('addUserJourney()');
    this.userJourneyService.startCreatingNewUserJourney()
  }
}
