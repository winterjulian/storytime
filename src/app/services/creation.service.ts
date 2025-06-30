import {Injectable, signal} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CreationService {
  public isCreatingNewUserJourney = signal<boolean>(false);
  public hasOpenedNewUserJourney = signal<boolean>(false);
  public isCreatingUserJourney = signal<boolean>(false);
  public isCreatingUserStep = signal<boolean>(false);
  public isCreatingNewElement = signal<boolean>(false);

  startCreatingNewUserJourney(): void {
    this.isCreatingNewUserJourney.set(true);
  }

  stopCreatingUserJourney(): void {
    this.isCreatingNewUserJourney.set(false);
    this.hasOpenedNewUserJourney.set(false);
  }

  triggerScrolling(): void {
    this.hasOpenedNewUserJourney.set(true);
  }

  setIsCreatingNewUserJourney(bool: boolean): void {
    this.isCreatingUserJourney.set(bool);
  }

  setIsCreatingUserStep(bool: boolean): void {
    this.isCreatingUserStep.set(bool);
  }

  setIsCreatingNewElement(bool: boolean): void {
    console.log('setting: ', bool);
    this.isCreatingNewElement.set(bool);
    if (bool) {
      this.scrollToElement('input-field')
    }
  }

  private scrollToElement(elementId: string) {
    const element = document.getElementById(elementId);
    console.log(element);
    // timeout 0s so angular updates dom first before doing scroll
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
