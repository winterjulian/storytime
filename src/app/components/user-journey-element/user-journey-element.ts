import {Component, ElementRef, HostListener, inject, input, signal} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {UserStepElement} from '../user-step-element/user-step-element';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';
import {UserStep} from '../../interfaces/user-step';

@Component({
  selector: 'app-user-journey-element',
  imports: [
    UserStepElement,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss'
})
export class UserJourneyElement {
  store = inject(StoreService)
  userJourneyService = inject(UserJourneyService)
  userJourney = input<UserJourney | undefined>(undefined)

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

  form = this.fb.group({
    title: this.fb.control<string>('', { validators: [Validators.required] })
  });

  applyEdit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.userJourneyService.stopCreatingUserJourney();
    this.store.createUserJourney(this.form);
  }

  cancelEdit() {
    console.log('cancelEdit');
    this.userJourneyService.stopCreatingUserJourney();
  }
}
