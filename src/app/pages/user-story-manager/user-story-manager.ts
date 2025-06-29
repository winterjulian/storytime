import {Component, inject} from '@angular/core';
import {UserStoryController} from '../../components/user-story-controller/user-story-controller';
import {IssueList} from '../../components/issue-list/issue-list';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';
import {TitledCard} from '../../components/titled-card/titled-card';
import {UserJourneyList} from '../../components/user-journey-list/user-journey-list';

@Component({
  selector: 'app-user-story-manager',
  imports: [
    UserStoryController,
    IssueList,
    TitledCard,
    UserJourneyList,
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
