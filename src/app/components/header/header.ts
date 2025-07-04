import {Component, ElementRef, inject, OnInit, signal, ViewChild} from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {StoreService} from '../../services/store.service';
import {PopupService} from '../../services/popup.service';
import {JsonService} from '../../services/json-service';
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
  public jsonService = inject(JsonService);
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

  triggerFileInput() {
    // programmatical click on invisible input:
    this.fileInput.nativeElement.click();
  }

  downloadJSON() {
    this.jsonService.downloadJSON();
  }

  handleFileUpload(event: Event) {
    this.jsonService.handleFileUpload(event);
  }
}
