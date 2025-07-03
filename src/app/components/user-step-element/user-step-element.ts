import {Component, inject, input, output} from '@angular/core';
import {UserStep} from '../../interfaces/user-step';
import {UserJourney} from '../../interfaces/user-journey';
import {StoreService} from '../../services/store.service';
import {PopupService} from '../../services/popup.service';
import {DragDropService} from '../../services/drag-drop.service';
import {UI_TEXTS as uiTexts} from '../../constants/ui-texts';

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
      uiTexts.popup.deleteStepTitle,
      uiTexts.popup.deleteStepText,
      {
        accept: () => {
          this.store.deleteStep(this.userStep());
          this.store.removeContainerMapReferencesByStep(this.userStep(), this.userJourney().id)
          this.dragDropService.clearHistory();
          this.dragDropService.removeAllDropZonesFromStep(this.userStep())
        }
      }
    );
  }
}
