import {Component, input, OnInit, output} from '@angular/core';
import {UserStep} from '../../interfaces/user-step';
import {UserJourney} from '../../interfaces/user-journey';

@Component({
  selector: 'app-user-step-element',
  imports: [],
  templateUrl: './user-step-element.html',
  styleUrl: './user-step-element.scss',
})
export class UserStepElement {
  public userStep = input.required<UserStep>();
  public userJourney = input.required<UserJourney>();
  public delete = output<void>();
}
