import {Injectable, signal} from '@angular/core';
import {UserJourney} from '../interfaces/user-journey';
import {Issue} from '../interfaces/issue';
import {FormGroup} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private _userJourneys = signal<Array<UserJourney>>([{
    title: 'Optimierung',
    id: '123',
    userSteps: [
      {
        id: '35de3',
        title: 'Email versenden',
        issues: []
      },
      {
        id: '3w253',
        title: 'Kekse',
        issues: []
      },
    ]
  }]);
  private _issues = signal<Array<Issue>>([]);

  public readonly userJourneys = this._userJourneys.asReadonly();
  public readonly issues = this._issues.asReadonly();

  // SETTER

  setUserJourneys(userJourneys: Array<UserJourney>) {
    this._userJourneys.set(userJourneys);
  }

  addUserJourney(userJourney: UserJourney) {
    const current = this._userJourneys();
    this._userJourneys.set([...current, userJourney]);
  }

  createUserJourney(form: FormGroup) {
    const title = form.controls['title']?.value;

    const newJourney: UserJourney = {
      id: this.getRandomId(),
      title,
      userSteps: []
    };

    this.addUserJourney(newJourney);
  }

  getRandomId(): string {
    let id: string;
    do {
      id = Math.random().toString(36).substring(2, 9); // zufälliger String
    } while (this._userJourneys().some(j => j.id === id));
    return id;
  }

  setIssues(issues: Array<Issue>) {
    this._issues.set(issues);
  }

  addIssue(issue: Issue) {
    const current = this._issues();
    this._issues.set([...current, issue]);
  }

  removeIssue(issueId: string) {
    const updated = this._issues().filter(i => i.id !== issueId);
    this._issues.set(updated);
  }

  removeUserJourney(journeyId: string) {
    const updated = this._userJourneys().filter(j => j.id !== journeyId);
    this._userJourneys.set(updated);
  }
}
