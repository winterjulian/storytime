import {Component, inject} from '@angular/core';
import {PopupService} from '../../services/popup.service';
import {NgComponentOutlet} from '@angular/common';

@Component({
  selector: 'app-popup',
  imports: [
    NgComponentOutlet
  ],
  standalone: true,
  templateUrl: './popup.html',
  styleUrl: './popup.scss'
})
export class Popup {
  public popupService = inject(PopupService);
}
