import {Component, inject} from '@angular/core';
import {StoreService} from '../../services/store.service';
import {UI_TEXTS as uiTexts} from '../../constants/ui-texts';
import {ReleaseElementDropSlot} from '../release-element-drop-slot/release-element-drop-slot';

@Component({
  selector: 'app-release-element',
  imports: [
    ReleaseElementDropSlot
  ],
  standalone: true,
  templateUrl: './release-element.html',
  styleUrl: './release-element.scss'
})
export class ReleaseElement {
  public store = inject(StoreService);
  
  public hint = uiTexts.releases.addStepHint;
  public userJourneys = this.store.userJourneys;
  public releaseId = crypto.randomUUID();
}
