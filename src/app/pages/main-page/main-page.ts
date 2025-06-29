import { Component } from '@angular/core';
import {UserStoryManager} from '../../components/user-story-manager/user-story-manager';
import {ReleaseManager} from '../../components/release-manager/release-manager';

@Component({
  selector: 'app-main-page',
  imports: [
    UserStoryManager,
    ReleaseManager,
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss'
})
export class MainPage {
}
