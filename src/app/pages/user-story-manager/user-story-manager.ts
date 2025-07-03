import {Component, inject,} from '@angular/core';
import {UserStoryController} from '../../components/user-story-controller/user-story-controller';
import {IssueList} from '../../components/issue-list/issue-list';
import {StoreService} from '../../services/store.service';
import {TitledArea} from '../../components/titled-card/titled-area';
import {UserJourneyArea} from '../../components/user-journey-list/user-journey-area.component';
import {UI_TEXTS as uiTexts} from '../../constants/ui-texts';

@Component({
  selector: 'app-user-story-manager',
  imports: [UserStoryController, IssueList, TitledArea, UserJourneyArea],
  standalone: true,
  templateUrl: './user-story-manager.html',
  styleUrl: './user-story-manager.scss',
})
export class UserStoryManager {
  public store = inject(StoreService)
  public journeyTitle = uiTexts.general.userJourneyAreaTitle;
  public selectionTitle = uiTexts.general.userJourneyAreaTitle;
}
