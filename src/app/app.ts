import {Component, inject} from '@angular/core';
import {Header} from './components/header/header';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {UserStoryManager} from './pages/user-story-manager/user-story-manager';
import {Popup} from './components/popup/popup';
import {PopupService} from './services/popup.service';
import {POPUP_TEXTS as popupTexts} from './components/popup/popup-texts';

@Component({
  selector: 'app-root',
  imports: [Header, DragDropModule, UserStoryManager, Popup],
  templateUrl: './app.html',
})
export class App {
  protected title = 'storytime';
}
