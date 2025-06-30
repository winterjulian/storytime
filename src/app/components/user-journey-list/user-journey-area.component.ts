import {Component, inject} from '@angular/core';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';
import {UserJourneyElement} from '../user-journey-element/user-journey-element';

@Component({
  selector: 'app-user-journey-area',
  imports: [
    UserJourneyElement
  ],
  templateUrl: './user-journey-area.component.html',
  styleUrl: './user-journey-area.component.scss'
})
export class UserJourneyArea {
  public userJourneyService = inject(UserJourneyService);
  public store = inject(StoreService)
  public userJourneys = this.store.userJourneys;
}
