import {Component, inject, signal} from '@angular/core';
import {InputField} from '../input-field/input-field';
import {FormBuilder, Validators} from '@angular/forms';
import {CreationService} from '../../services/creation.service';
import {StoreService} from '../../services/store.service';

@Component({
  selector: 'app-user-journey-element-create',
  imports: [
    InputField
  ],
  templateUrl: './user-journey-element-create.html',
  styleUrl: './user-journey-element-create.scss'
})
export class UserJourneyElementCreate {
  public store = inject(StoreService);
  public userJourneyService = inject(CreationService);
  private fb = inject(FormBuilder);
  form = this.fb.group({
    input: this.fb.control<string>('', {validators: [Validators.required]}),
  });

  acceptUserStory() {
    console.log('>>> acceptUserStory');
    this.store.createUserJourney(this.form, 'input')
  }

  cancelUserStory() {
    console.log('>>> cancelUserStory');
    this.userJourneyService.isCreatingNewUserJourney.set(false);
  }
}
