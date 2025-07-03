import {computed, inject, Injectable, signal} from '@angular/core';
import {UserJourney} from '../interfaces/user-journey';
import {StepIssue} from '../interfaces/step-issue';
import {FormGroup} from '@angular/forms';
import {UserStep} from '../interfaces/user-step';
import {IndexedDbService} from './indexed-db.service';
import {GitlabIssuesService} from './gitlab-issues.service';
import {DbStepIssue} from './models/db-step-issue.model';
import {CdkDragDrop} from '@angular/cdk/drag-drop';

@Injectable({providedIn: 'root'})
export class StoreService {

  private db = inject(IndexedDbService);
  private issueService = inject(GitlabIssuesService);

  public issues = signal<Array<StepIssue>>([]);
  public gitlabIssues = computed(() => {
    const dbIssues = this.db.issues();
    if (!dbIssues) return [];

    const gitlabAll = this.issueService.getIssues(); // synchron
    const dbIssueIds = new Set(dbIssues.map(i => i.id));
    return gitlabAll.filter(issue => !dbIssueIds.has(issue.id));
  });
  public userJourneys = computed<UserJourney[]>(() => {
    const journeys = this.db.journeys();
    const steps = this.db.steps();
    const issues = this.db.issues();

    if (!journeys || !steps || !issues) {
      return [];
    }

    this.sortData(journeys);

    const returnValue = journeys.map(journey => ({
      ...journey,
      userSteps: this.sortData(
        steps
          .filter(step => step.journeyId === journey.id)
          .map(step => ({
            ...step,
            issues: issues.filter(issue => issue.stepId === step.id),
          }))
      ),
    }));
    console.log(returnValue);
    return returnValue;
  });

  private sortData<T extends { order: number }>(array: Array<T>) {
    return array.sort((a, b) => a.order - b.order);
  }

  deleteJourney(id: string): void {
    this.db.deleteJourneyCascade(id);
  }

  deleteStep(stepId: string): void {
    this.db.deleteStepCascade(stepId);
  }

  createUserJourney(form: FormGroup, key: string) {
    const title = form.controls[key]?.value;

    const newJourney: UserJourney = {
      id: this.getRandomId(),
      title,
      order: this.determineOrder(this.userJourneys()),
      userSteps: [],
    };

    this.db.addJourney(newJourney);
  }

  determineOrder<T extends { order: number }>(array: T[]): number {
    if (array.length === 0) return 0;
    return Math.max(...array.map(e => e.order)) + 1;
  }

  createUserJourneyStep(
    journey: UserJourney,
    form: FormGroup,
    key: string,
  ): void {
    const title = form.controls[key]?.value;
    const newUserStep: UserStep = {
      id: this.getRandomId(),
      title,
      order: journey.userSteps.length,
      journeyId: journey.id,
      issues: [],
    };

    journey.userSteps.push(newUserStep);
    this.db.addStep(newUserStep)
  }

  getRandomId(): string {
    return crypto.randomUUID();
  }

  /**
   * Deprecated
   * @param issues
   */
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

  saveIssueInStep(event: CdkDragDrop<StepIssue[]>, issue: StepIssue, stepId: string) {
    // const previousContainer = event.previousContainer.id;
    // const targetContainer = event.container.id;
    //
    // if (previousContainer !== targetContainer) {
    //   this.db.deleteIssue(issue.id)
    //   this.db.addIssue({
    //     ...issue,
    //     stepId: stepId
    //   });
    // }
  }

  transferIssues(item: StepIssue, target: string): void {
    this.db.deleteIssue(item.id)
    console.log(target);
    if (target !== 'issue-list') {
      // put-back issue will be part of issue-list reload
      this.db.addIssue({
        ...item,
        stepId: target
      });
    }
  }

  isContainerEqualToPreviousContainer(event: CdkDragDrop<StepIssue[]>) {
    return event.container.id === event.previousContainer.id;
  }

  deleteIssueFromStep(issue: DbStepIssue) {
    this.db.deleteIssue(issue.id);
  }

  // INDEXEDDB

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


