import {Injectable, signal} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserJourneyService {
  public isCreatingNewUserJourney = signal<boolean>(false);

  startCreatingNewUserJourney(): void {
    this.isCreatingNewUserJourney.set(true);
  }

  stopCreatingUserJourney(): void {
    this.isCreatingNewUserJourney.set(false);
  }
}
