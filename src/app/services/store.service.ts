import {computed, inject, Injectable, signal} from '@angular/core';
import {UserJourney} from '../interfaces/user-journey';
import {StepIssue} from '../interfaces/step-issue';
import {FormGroup} from '@angular/forms';
import {UserStep} from '../interfaces/user-step';
import {Journey} from './models/journey.model';
import {Step} from './models/step.model';
import {Issue} from './models/issue.model';
import {IndexedDbService} from './indexed-db.service';

@Injectable({providedIn: 'root'})
export class StoreService {
  // private userJourneys = signal<Array<UserJourney>>([]);
  public userJourneys = computed<UserJourney[]>(() => {
    return this.db.journeys().map(journey => {
      const userSteps = this.db.steps()
        .filter(step => step.journeyId === journey.id)
        .map(step => ({
          ...step,
          issues: this.db.issues().filter(issue => issue.stepId === step.id),
        }));

      return {
        ...journey,
        userSteps,
      };
    });
  });
  public issues = signal<Array<StepIssue>>([]);

  deleteJourney(id: string): void {
    this.db.deleteJourney(id);
  }

  deleteStep(id: string): void {
    this.db.deleteStep(id);
  }

  // SETTER

  addUserJourney(userJourney: UserJourney) {
    console.log(userJourney);
    // const current = this.userJourneys();
    // this.userJourneys.set([...current, userJourney]);
  }

  createUserJourney(form: FormGroup, key: string) {
    const title = form.controls[key]?.value;
    const newJourney: UserJourney = {
      id: this.getRandomId(this.userJourneys()),
      title,
      userSteps: [],
    };

    this.addUserJourney(newJourney);
  }

  createUserJourneyStep(
    journey: UserJourney,
    form: FormGroup,
    key: string,
  ): void {
    const title = form.controls[key]?.value;
    const newStep: UserStep = {
      id: journey.id + '-' + this.getRandomId(journey.userSteps),
      title,
      issues: [],
    };

    journey.userSteps.push(newStep);
  }

  getRandomId(arrayToCheck: Array<UserJourney | UserStep>): string {
    let id: string;
    do {
      id = Math.random().toString(36).substring(2, 9);
    } while (arrayToCheck.some((item) => item.id === id));
    return id;
  }

  setIssues(issues: Array<StepIssue>) {
    this.issues.set(issues);
  }

  addIssue(issue: StepIssue) {
    const current = this.issues();
    this.issues.set([...current, issue]);
  }

  removeIssue(issueId: string) {
    const updated = this.issues().filter((i) => i.id !== issueId);
    this.issues.set(updated);
  }

  // INDEXEDDB

  public db = inject(IndexedDbService);

  // public journeysWithSteps = computed<UserJourney[]>(() => {
  //   return this.db.journeys().map(journey => {
  //     const userSteps = this.db.steps()
  //       .filter(step => step.journeyId === journey.id)
  //       .map(step => ({
  //         ...step,
  //         issues: this.db.issues().filter(issue => issue.stepId === step.id),
  //       }));
  //
  //     return {
  //       ...journey,
  //       userSteps,
  //     };
  //   });
  // });

}
