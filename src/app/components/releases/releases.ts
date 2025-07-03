import {Component, inject, signal} from '@angular/core';
import {UI_TEXTS as uiTexts} from '../../constants/ui-texts';
import {Release} from '../../interfaces/release';
import {StoreService} from '../../services/store.service';
import {ReleaseElement} from '../release-element/release-element';

@Component({
  selector: 'app-releases',
  imports: [
    ReleaseElement
  ],
  standalone: true,
  templateUrl: './releases.html',
  styleUrl: './releases.scss',
})
export class Releases {
  public store = inject(StoreService);
  public title = uiTexts.general.releasesArea;
  public releases = this.store.releases;

  // public releases = signal<Array<any>>([{id: '123', name: 'Test'}]);

  addRelease() {
    const release: Release = {
      id: crypto.randomUUID(),
      title: '',
      issues: [],
    }
    this.releases.update((currentReleases) => [...currentReleases, release]);
  }
}
