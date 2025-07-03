import {
  Component, inject,
  input,
  output,
} from '@angular/core';
import {UserJourney} from '../../interfaces/user-journey';
import {StoreService} from '../../services/store.service';
import {PopupService} from '../../services/popup.service';
import {DragDropService} from '../../services/drag-drop.service';
import {UI_TEXTS as uiTexts} from '../../constants/ui-texts';

@Component({
  selector: 'app-user-journey-element',
  imports: [],
  standalone: true,
  templateUrl: './user-journey-element.html',
  styleUrl: './user-journey-element.scss',
})
export class UserJourneyElement {
  // SERVICES
  public store = inject(StoreService);
  public dragDropService = inject(DragDropService);
  public popupService = inject(PopupService);

  // INPUTS & OUPUTS
  userJourney = input.required<UserJourney>();
  public apply = output<void>();

  deleteJourney() {
    this.popupService.openWithMessage(
      uiTexts.popup.deleteJourneyTitle,
      uiTexts.popup.deleteJourneyText,
      {
        accept: () => {
          this.store.deleteJourney(this.userJourney());
          this.store.removeContainerMapReferencesByJourney(this.userJourney())
          this.dragDropService.clearHistory();
          this.dragDropService.removeAllDropZonesFromJourney(this.userJourney());
        }
      }
    );
  }
}
