import { Component } from '@angular/core';
import {Header} from './components/header/header';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {UserStoryManager} from './pages/user-story-manager/user-story-manager';

@Component({
  selector: 'app-root',
  imports: [
    Header,
    DragDropModule,
    UserStoryManager
  ],
  templateUrl: './app.html',
})
export class App {
  protected title = 'storytime';
}
