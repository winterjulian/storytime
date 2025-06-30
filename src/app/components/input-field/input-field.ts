import {
  Component,
  ElementRef,
  HostListener,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, NgClass],
  standalone: true,
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField {
  public form = input.required<FormGroup>();
  public placeholder = input<string>('New...');
  public apply = output<void>();
  public cancel = output<void>();

  constructor(private elRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.cancelEdit();
    }
  }

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.applyEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  get control(): FormControl {
    return this.form().controls['input'] as FormControl;
  }

  resetInput() {
    this.form().controls['input'].reset();
  }

  applyEdit() {
    this.apply.emit();
    this.resetInput();
  }

  cancelEdit() {
    this.cancel.emit();
    this.resetInput();
  }
}
