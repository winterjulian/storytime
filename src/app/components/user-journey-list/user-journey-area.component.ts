import {Component, inject} from '@angular/core';
import {StoreService} from '../../services/store.service';
import {UserJourneyElement} from '../user-journey-element/user-journey-element';
import {UserStepElement} from '../user-step-element/user-step-element';
import {UserStepElementCreate} from '../user-step-element-create/user-step-element-create';
import {UserJourneyElementCreate} from '../user-journey-element-create/user-journey-element-create';
import {IssueListWrapper} from '../issue-list-wrapper/issue-list-wrapper';
import {Releases} from '../releases/releases';

@Component({
  selector: 'app-user-journey-area',
  imports: [UserJourneyElement, UserStepElement, UserStepElementCreate, UserJourneyElementCreate, IssueListWrapper, Releases],
  standalone: true,
  templateUrl: './user-journey-area.component.html',
  styleUrl: './user-journey-area.component.scss',
})
export class UserJourneyArea {
  // SERVICES
  public store = inject(StoreService);

  // VARIABLES
  public userJourneys = this.store.userJourneys;
}
