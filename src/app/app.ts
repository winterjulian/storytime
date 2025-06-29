import { Component } from '@angular/core';
import {MainPage} from './pages/main-page/main-page';
import {Header} from './components/header/header';
import {DragDropModule} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  imports: [
    MainPage,
    Header,
    DragDropModule
  ],
  templateUrl: './app.html',
})
export class App {
  protected title = 'storytime';
}
