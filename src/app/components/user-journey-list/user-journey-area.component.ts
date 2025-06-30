import {Component, inject} from '@angular/core';
import {CreationService} from '../../services/creation.service';
import {StoreService} from '../../services/store.service';
import {UserJourneyElement} from '../user-journey-element/user-journey-element';
import {UserStepElement} from '../user-step-element/user-step-element';
import {UserStepCreateElement} from '../user-step-create-element/user-step-create-element';
import {UserStepElementCreate} from '../user-step-element-create/user-step-element-create';
import {UserJourneyElementCreate} from '../user-journey-element-create/user-journey-element-create';

@Component({
  selector: 'app-user-journey-area',
  imports: [UserJourneyElement, UserStepElement, UserStepElementCreate, UserJourneyElementCreate],
  standalone: true,
  templateUrl: './user-journey-area.component.html',
  styleUrl: './user-journey-area.component.scss',
})
export class UserJourneyArea {
  public userJourneyService = inject(CreationService);
  public store = inject(StoreService);
  public userJourneys = this.store.userJourneys;
}
