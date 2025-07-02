import {
  Component, inject,
  input,
  output,
} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {StoreService} from '../../services/store.service';
import {PopupService} from '../../services/popup.service';
import {POPUP_TEXTS as popupTexts} from '../popup/popup-texts';

@Component({
  selector: 'app-user-journey-element',
  imports: [],
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss',
})
export class UserJourneyElement {
  public store = inject(StoreService);
  userJourney = input.required<UserJourney>();
  public apply = output<void>();

  public popupService = inject(PopupService);

  deleteJourney(id: string) {
    this.popupService.openWithMessage(
      popupTexts.deleteJourneyTitle,
      popupTexts.deleteJourneyText,
      {
        accept: () => {
          this.store.deleteJourney(id)
        }
      }
    );
  }
}
