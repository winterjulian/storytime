import {Component, effect, ElementRef, inject, input, ViewChild} from '@angular/core';
import {UserJourneyService} from '../../services/user-journey.service';

@Component({
  selector: 'app-titled-card',
  imports: [],
  templateUrl: './titled-card.html',
  styleUrl: './titled-card.scss'
})
export class TitledCard {
  public title = input<string>('');

  public userJourneyService = inject(UserJourneyService);

  @ViewChild('scrollContainer', { static: false })
  scrollContainer!: ElementRef;

  scrollToRight() {
  const el = this.scrollContainer.nativeElement as HTMLElement;
    el.scrollTo({
      left: el.scrollWidth - el.clientWidth,
      behavior: 'smooth'
    });
  }

  scrollToBottom() {
    const el = this.scrollContainer.nativeElement as HTMLElement;
    el.scrollTo({
      top: el.scrollHeight - el.clientHeight,
      behavior: 'smooth'
    });
  }
}
