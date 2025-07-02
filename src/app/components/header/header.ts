import {Component, inject, OnInit, signal} from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {IndexedDbService} from '../../services/indexed-db.service';
import {StoreService} from '../../services/store.service';
import {UserJourney} from '../../interfaces/user-journey';

@Component({
  selector: 'app-header',
  imports: [],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  public themeService = inject(ThemeService);
  public db = inject(IndexedDbService);
  public store = inject(StoreService);
  public isDarkMode = signal<boolean>(false);
  public journeys = signal<UserJourney[]>([]);

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

  async saveJourneys() {
    // TODO: Keep for fake stories
    // TODO: Remove when not needed
    const journeyId = crypto.randomUUID();
    const journeys = this.db.journeys();
    await this.db.addJourney({
      id: journeyId,
      title: 'Meine erste Journey',
      order: journeys ? journeys.length : 0,
    });

    await this.db.addStep({
      id: crypto.randomUUID(),
      title: 'Erster Step',
      journeyId: journeyId, // Hier die id der gespeicherten Journey einsetzen
      order: journeys ? journeys.length : 0,
    });
  }

  purgeDb() {
    this.db.clearDatabaseCompletely();
  }
}
