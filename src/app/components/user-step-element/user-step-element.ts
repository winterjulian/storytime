import {Component, inject, input, OnInit, output} from '@angular/core';
import {UserStep} from '../../interfaces/user-step';
import {UserJourney} from '../../interfaces/user-journey';
import {POPUP_TEXTS as popupTexts} from '../popup/popup-texts';
import {StoreService} from '../../services/store.service';
import {PopupService} from '../../services/popup.service';
import {DragDropService} from '../../services/drag-drop.service';

@Component({
  selector: 'app-user-step-element',
  imports: [],
  templateUrl: './user-step-element.html',
  styleUrl: './user-step-element.scss',
})
export class UserStepElement {
  public store = inject(StoreService);
  public dragDropService = inject(DragDropService);
  public popupService = inject(PopupService);

  public userStep = input.required<UserStep>();
  public userJourney = input.required<UserJourney>();
  public delete = output<void>();

  deleteStep(): void {
    this.popupService.openWithMessage(
      popupTexts.deleteStepTitle,
      popupTexts.deleteStepText,
      {
        accept: () => {
          this.store.deleteStep(this.userStep());
          this.dragDropService.clearHistory();
          this.dragDropService.removeAllDropZonesFromStep(this.userStep())
        }
      }
    );
  }
}
