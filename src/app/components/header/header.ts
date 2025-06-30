import {Component, inject, OnInit, signal} from '@angular/core';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  public themeService = inject(ThemeService);
  public isDarkMode = signal<boolean>(false);

  ngOnInit() {
    console.log('>>> ngOnInit()');
    console.log('>>> getDisplayMode(): ', this.themeService.getIfDisplayModeIsDark())
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

  // toggleDark() {
  //   document.documentElement.classList.toggle('dark');
  //   this.isDarkMode = document.documentElement.classList.contains('dark');
  // }
}
