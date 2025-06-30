import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  imports: [],
  standalone: true,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public isDarkMode = false;

  toggleDark() {
    document.documentElement.classList.toggle('dark');
    this.isDarkMode = document.documentElement.classList.contains('dark');
  }
}
