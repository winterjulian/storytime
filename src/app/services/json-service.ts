import {inject, Injectable} from '@angular/core';
import {UI_TEXTS as uiTexts} from '../constants/ui-texts';
import {StoreService} from './store.service';
import {PopupService} from './popup.service';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  public store = inject(StoreService);
  public popupService = inject(PopupService);

  downloadJSON() {
    const jsonString = JSON.stringify(this.store.userJourneys(), null, 2);

    const blob = new Blob([jsonString], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const anchorElement = document.createElement('a');
    anchorElement.href = url;
    anchorElement.download = 'user-journey.json';
    anchorElement.click();

    URL.revokeObjectURL(url);
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const content = reader.result as string;
        const parsed = JSON.parse(content);
        this.store.setUserJourneysFromJSON(parsed);
      } catch (err) {
        this.popupService.openWithMessage(
          uiTexts.popup.fileUploadErrorTitle,
          uiTexts.popup.fileUploadErrorText,
          {
            accept: () => {
              this.store.purgeDb();
            }
          },
          true,
        )
      }
    };

    reader.readAsText(file);
  }
}
