import {Component, inject, input} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-user-step-create-element',
  imports: [
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './user-step-create-element.html',
  styleUrl: './user-step-create-element.scss'
})
export class UserStepCreateElement {
  userJourney = input.required<UserJourney>();

  private fb = inject(FormBuilder);

  form = this.fb.group({
    stepTitle: this.fb.control<string>('', { validators: [Validators.required] })
  });
}
