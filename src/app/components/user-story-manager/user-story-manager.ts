import {Component, inject, signal} from '@angular/core';
import {UserStoryController} from '../user-story-controller/user-story-controller';
import {IssueList} from '../issue-list/issue-list';
import {UserJourneyElement} from '../user-journey-element/user-journey-element';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';

@Component({
  selector: 'app-user-story-manager',
  imports: [
    UserStoryController,
    IssueList,
    UserJourneyElement,
  ],
  standalone: true,
  templateUrl: './user-story-manager.html',
  styleUrl: './user-story-manager.scss'
})
export class UserStoryManager {
  public userJourneyService = inject(UserJourneyService);
  public store = inject(StoreService)
  public userJourneys = this.store.userJourneys;
}
