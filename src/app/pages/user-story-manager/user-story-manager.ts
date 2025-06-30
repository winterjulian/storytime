import {Component, effect, ElementRef, inject, ViewChild} from '@angular/core';
import {UserStoryController} from '../../components/user-story-controller/user-story-controller';
import {IssueList} from '../../components/issue-list/issue-list';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';
import {TitledArea} from '../../components/titled-card/titled-area';
import {UserJourneyArea} from '../../components/user-journey-list/user-journey-area.component';

@Component({
  selector: 'app-user-story-manager',
  imports: [
    UserStoryController,
    IssueList,
    TitledArea,
    UserJourneyArea,
  ],
  standalone: true,
  templateUrl: './user-story-manager.html',
  styleUrl: './user-story-manager.scss'
})
export class UserStoryManager {
  public store = inject(StoreService)
  public userJourneyService = inject(UserJourneyService);
  public userJourneys = this.store.userJourneys;

  @ViewChild('journeyCard') titledCard!: TitledArea;

  constructor() {
    effect(() => {
      this.userJourneyService.hasOpenedNewUserJourney() ? this.titledCard.scrollToRight() : null;
    });
  }
}
