import {
  Component,
  input,
  output,
} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';

@Component({
  selector: 'app-user-journey-element',
  imports: [],
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss',
})
export class UserJourneyElement {
  userJourney = input.required<UserJourney>();
  public apply = output<void>();
}
