import {Component, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {StoreService} from '../../services/store.service';
import {PopupService} from '../../services/popup.service';
import {UI_TEXTS as uiTexts} from '../../constants/ui-texts';

@Component({
  selector: 'app-header',
  imports: [],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  public store = inject(StoreService);
  public popupService = inject(PopupService);
  public themeService = inject(ThemeService);

  public isDarkMode = signal<boolean>(false);

  ngOnInit() {
    const isDark = document.documentElement.classList.contains('dark');
    const hasDarkPreferences = this.themeService.getIfDisplayModeIsDark();
    this.isDarkMode.set(hasDarkPreferences);
    if (hasDarkPreferences && !isDark) {
      this.toggleDarkClass();
    }
  }

  toggleDark() {
    this.toggleDarkClass();
    this.isDarkMode.update(b => !b);
    this.themeService.setDisplayMode(this.isDarkMode())
  }

  toggleDarkClass() {
    document.documentElement.classList.toggle('dark');
  }

  purgeDb() {
    this.popupService.openWithMessage(
      uiTexts.popup.purgeDBTitle,
      uiTexts.popup.purgeDBText,
      {
        accept: () => {
          this.store.purgeDb();
        }
      }
    )
  }

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

  triggerFileInput() {
    this.fileInput.nativeElement.click();
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
        this.store.setUserJourneys(parsed);
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
