import {Component, inject, input, signal} from '@angular/core';
import {InputField} from "../input-field/input-field";
import {StoreService} from '../../services/store.service';
import {UserJourney} from '../../interfaces/user-journey';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-step-element-create',
  imports: [
    InputField
  ],
  standalone: true,
  templateUrl: './user-step-element-create.html',
  styleUrl: './user-step-element-create.scss'
})
export class UserStepElementCreate {
  public store = inject(StoreService);
  userJourney = input.required<UserJourney>();

  isAddingUserStep = signal<boolean>(false);

  private fb = inject(FormBuilder);
  form = this.fb.group({
    input: this.fb.control<string>('', {
      validators: [Validators.required],
    }),
  });

  setIsAddingUserStep() {
    this.isAddingUserStep.update(() => true);
  }

  acceptUserStep() {
    this.store.createUserJourneyStep(this.userJourney(), this.form, 'input')
  }

  cancelUserStep() {
    this.isAddingUserStep.update(() => false);
  }
}
