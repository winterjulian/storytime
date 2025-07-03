import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CreationService {
  public isCreatingNewUserJourney = signal<boolean>(false);
  public isCreatingNewElement = signal<boolean>(false);

  startCreatingNewUserJourney(): void {
    this.isCreatingNewUserJourney.set(true);
  }

  setIsCreatingNewElement(bool: boolean): void {
    this.isCreatingNewElement.set(bool);
    if (bool) {
      this.scrollToElement('input-field')
    }
  }

  private scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    // timeout 0s so angular updates dom before doing scroll
    setTimeout(() => {
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'center'
        });
      }
    }, 0)
  }
}
