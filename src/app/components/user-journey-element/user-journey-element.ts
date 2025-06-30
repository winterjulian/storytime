import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { UserJourney } from '../../interfaces/user-journey';
import { UserStepElement } from '../user-step-element/user-step-element';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserJourneyService } from '../../services/user-journey.service';
import { StoreService } from '../../services/store.service';
import { InputField } from '../input-field/input-field';

@Component({
  selector: 'app-user-journey-element',
  imports: [UserStepElement, ReactiveFormsModule, InputField],
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss',
})
export class UserJourneyElement implements OnInit {
  store = inject(StoreService);
  userJourneyService = inject(UserJourneyService);

  userJourney = input<UserJourney | undefined>(undefined); // undefined = creating
  isUserStepAdding = signal<boolean>(false);
  public apply = output<void>();

  private fb = inject(FormBuilder);
  journeyForm = this.fb.group({
    input: this.fb.control<string>('', { validators: [Validators.required] }),
  });
  stepForm = this.fb.group({
    input: this.fb.control<string>('', { validators: [Validators.required] }),
  });

  ngOnInit() {
    if (!this.userJourney()) {
      // trigger only when new userJourney (undefined)
      this.userJourneyService.triggerScrolling();
    }
  }

  applyNewJourney(): void {
    if (this.journeyForm.invalid) {
      this.journeyForm.markAllAsTouched();
      return;
    }

    this.userJourneyService.stopCreatingUserJourney();
    this.store.createUserJourney(this.journeyForm, 'input');
  }

  cancelNewJourney() {
    this.userJourneyService.stopCreatingUserJourney();
  }

  applyNewStep() {
    const form = this.stepForm;
    const journey = this.userJourney();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    if (journey) {
      this.store.createUserJourneyStep(journey, form, 'input');
    }
  }

  cancelNewStep(boolean: boolean) {
    this.isUserStepAdding.set(boolean);
  }
}
