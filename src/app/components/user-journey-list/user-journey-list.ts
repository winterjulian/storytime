import {Component, inject} from '@angular/core';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';
import {UserJourneyElement} from '../user-journey-element/user-journey-element';

@Component({
  selector: 'app-user-journey-list',
  imports: [
    UserJourneyElement
  ],
  templateUrl: './user-journey-list.html',
  styleUrl: './user-journey-list.scss'
})
export class UserJourneyList {
  public userJourneyService = inject(UserJourneyService);
  public store = inject(StoreService)
  public userJourneys = this.store.userJourneys;
}
