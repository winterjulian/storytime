import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener, inject,
  input, OnInit,
  output, ViewChild,
} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {NgClass} from '@angular/common';
import {CreationService} from '../../services/creation.service';

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, NgClass],
  standalone: true,
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField implements OnInit, AfterViewInit {
  @ViewChild('inputField') inputRef!: ElementRef<HTMLInputElement>;

  public creationService = inject(CreationService);

  public form = input.required<FormGroup>();
  public placeholder = input<string>('New...');
  public accept = output<void>();
  public cancel = output<void>();

  constructor(private elRef: ElementRef) {
  }

  @HostListener('document:mousedown', ['$event'])
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

  ngOnInit() {
    this.creationService.setIsCreatingNewElement(true);
    this.inputRef.nativeElement.focus();
  }

  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
    // makes scroll functionality unnecessary ... yay.
  }

  get control(): FormControl {
    return this.form().controls['input'] as FormControl;
  }

  resetComponent() {
    this.form().controls['input'].reset();
    this.creationService.setIsCreatingNewElement(false);
  }

  applyEdit() {
    this.accept.emit();
    this.resetComponent();
    this.creationService.setIsCreatingNewElement(true);
  }

  cancelEdit() {
    this.cancel.emit();
    this.resetComponent();
  }
}
