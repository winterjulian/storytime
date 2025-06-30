import {
    Component,
    ElementRef,
    HostListener,
    inject,
    signal,
} from '@angular/core';
import {CreationService} from '../../services/creation.service';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import {NgClass} from '@angular/common';
import {StoreService} from '../../services/store.service';

@Component({
    selector: 'app-user-journey-create-element',
    imports: [ReactiveFormsModule, NgClass],
    standalone: true,
    templateUrl: './user-journey-create-element.html',
    styleUrl: './user-journey-create-element.scss',
})
export class UserJourneyCreateElement {
    public userJourneyService = inject(CreationService);
    public store = inject(StoreService);

    private fb = inject(FormBuilder);
    form = this.fb.group({
        title: this.fb.control<string>('', {validators: [Validators.required]}),
    });

    public name = signal<string>('');

    constructor(private elRef: ElementRef) {
    }

    @HostListener('document:click', ['$event'])
    handleClick(event: MouseEvent) {
        const clickedInside = this.elRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.cancelEdit();
        }
    }

    applyEdit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.userJourneyService.stopCreatingUserJourney();
        this.store.createUserJourney(this.form, 'input');
    }

    cancelEdit() {
        this.userJourneyService.stopCreatingUserJourney();
    }
}
