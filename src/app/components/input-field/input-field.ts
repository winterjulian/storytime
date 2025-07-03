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
  @ViewChild('inputField', {static: false}) inputRef!: ElementRef;

  public form = input.required<FormGroup>();
  public placeholder = input<string>('New...');
  public accept = output<void>();
  public cancel = output<void>();

  constructor(
    public creationService: CreationService,
    private elRef: ElementRef
  ) {
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
    if (event.key === 'Enter' && event.ctrlKey) {
      this.applyEdit();
    } else if (event.key === 'Enter') {
      this.applyEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  ngOnInit() {
    this.creationService.setIsCreatingNewElement(true);
  }

  ngAfterViewInit() {
    this.inputRef.nativeElement.focus();
  }

  get control(): FormControl {
    return this.form().controls['input'] as FormControl;
  }

  applyEdit() {
    if (this.form().valid) {
      this.accept.emit();
      this.resetComponent();
      this.creationService.setIsCreatingNewElement(true);
    } else {
      this.control.markAsTouched();
    }
  }

  cancelEdit() {
    this.cancel.emit();
    this.resetComponent();
  }

  resetComponent() {
    this.form().controls['input'].reset();
    this.creationService.setIsCreatingNewElement(false);
  }
}
