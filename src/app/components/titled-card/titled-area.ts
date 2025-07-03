import {
  Component,
  ElementRef,
  input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-titled-area',
  imports: [],
  templateUrl: './titled-area.html',
  styleUrl: './titled-area.scss',
})
export class TitledArea {
  public title = input<string>('');

  @ViewChild('scrollContainer', {static: false})
  scrollContainer!: ElementRef;

  scrollToRight() {
    const el = this.scrollContainer.nativeElement as HTMLElement;
    el.scrollTo({
      left: el.scrollWidth - el.clientWidth,
      behavior: 'smooth',
    });

  }

  scrollToBottom() {
    const el = this.scrollContainer.nativeElement as HTMLElement;
    el.scrollTo({
      top: el.scrollHeight - el.clientHeight,
      behavior: 'smooth',
    });
  }
}
