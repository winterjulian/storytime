import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  output,
  signal
} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {UserStepElement} from '../user-step-element/user-step-element';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserJourneyService} from '../../services/user-journey.service';
import {StoreService} from '../../services/store.service';
import {InputField} from '../input-field/input-field';

@Component({
  selector: 'app-user-journey-element',
  imports: [
    UserStepElement,
    ReactiveFormsModule,
    InputField
  ],
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss'
})
export class UserJourneyElement implements OnInit {
  store = inject(StoreService);
  userJourneyService = inject(UserJourneyService);
  userJourney = input<UserJourney | undefined>(undefined);
  isUserStepAdding = signal<boolean>(false);
  public apply = output<void>();

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (!this.userJourney()) {
      const clickedInside = this.elRef.nativeElement.contains(event.target);
      if (!clickedInside) {
        // this.cancelEdit();
      }
    }
  }

  private fb = inject(FormBuilder);
  journeyForm = this.fb.group({
    input: this.fb.control<string>('', { validators: [Validators.required] })
  });

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    if (!this.userJourney()) {
      this.userJourneyService.triggerScrolling();
    }
  }

  stepForm = this.fb.group({
    input: this.fb.control<string>('', { validators: [Validators.required] })
  });

  applyNewJourney(): void {
    if (this.journeyForm.invalid) {
      this.journeyForm.markAllAsTouched();
      return;
    }

    console.log(this.journeyForm);

    this.userJourneyService.stopCreatingUserJourney();
    this.store.createUserJourney(this.journeyForm, 'input');
  }

  cancelNewJourney() {
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
      this.store.createUserJourneyStep(journey, form, 'input')
    }
  }

  cancelNewStep(boolean: boolean) {
    this.isUserStepAdding.set(boolean);
  }
}
