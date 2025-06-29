import {Component, input} from '@angular/core';

@Component({
  selector: 'app-titled-card',
  imports: [],
  templateUrl: './titled-card.html',
  styleUrl: './titled-card.scss'
})
export class TitledCard {
  public title = input<string>('');
}
