import {Component} from '@angular/core';
import {Header} from './components/header/header';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {UserStoryManager} from './pages/user-story-manager/user-story-manager';
import {Popup} from './components/popup/popup';

@Component({
  selector: 'app-root',
  imports: [Header, DragDropModule, UserStoryManager, Popup],
  templateUrl: './app.html',
})
export class App {
}
