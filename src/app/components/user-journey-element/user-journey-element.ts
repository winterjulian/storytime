import {
  Component,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {ReactiveFormsModule} from '@angular/forms';
import {CreationService} from '../../services/creation.service';

@Component({
  selector: 'app-user-journey-element',
  imports: [ReactiveFormsModule],
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss',
})
export class UserJourneyElement implements OnInit {
  creationService = inject(CreationService);

  userJourney = input.required<UserJourney>();
  public apply = output<void>();

  ngOnInit() {
    // // TODO: Logic outdated, implement a new one
    // if (!this.userJourney()) {
    //   // trigger only when new userJourney (undefined)
    //   this.creationService.triggerScrolling();
    // }
  }
}
