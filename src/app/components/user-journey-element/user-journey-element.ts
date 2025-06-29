import {Component, ElementRef, HostListener, inject, input, signal} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {UserStepElement} from '../user-step-element/user-step-element';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';
import {InputField} from '../input-field/input-field';

@Component({
  selector: 'app-user-journey-element',
  imports: [
    UserStepElement,
    ReactiveFormsModule,
    NgClass,
    InputField
  ],
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss'
})
export class UserJourneyElement {
  store = inject(StoreService);
  userJourneyService = inject(UserJourneyService);
  userJourney = input<UserJourney | undefined>(undefined);
  isUserStepAdding = signal<boolean>(false);

  private fb = inject(FormBuilder);

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (!this.userJourney()) {
      const clickedInside = this.elRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        this.cancelEdit();
      }
    }
  }

  journeyForm = this.fb.group({
    title: this.fb.control<string>('', { validators: [Validators.required] })
  });

  stepForm = this.fb.group({
    input: this.fb.control<string>('', { validators: [Validators.required] })
  });

  applyEdit(): void {
    if (this.journeyForm.invalid) {
      this.journeyForm.markAllAsTouched();
      return;
    }

    this.userJourneyService.stopCreatingUserJourney();
    this.store.createUserJourney(this.journeyForm);
  }

  cancelEdit() {
    console.log('cancelEdit');
    this.userJourneyService.stopCreatingUserJourney();
  }

  applyNewStep() {
    console.log('applyNewStep');
    const form = this.stepForm;
    const journey = this.userJourney();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    if (journey) {
      this.store.createUserJourneyStep(journey, form)
    }
  }

  setIsUserStepAdding(boolean: boolean) {
    this.isUserStepAdding.set(boolean);
  }
}
