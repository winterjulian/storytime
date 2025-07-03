import {computed, inject, Injectable, signal} from '@angular/core';
import {UserJourney} from '../interfaces/user-journey';
import {StepIssue} from '../interfaces/step-issue';
import {FormGroup} from '@angular/forms';
import {UserStep} from '../interfaces/user-step';
import {IndexedDbService} from './indexed-db.service';
import {GitlabIssuesService} from './gitlab-issues.service';
import {DbStepIssue} from './models/db-step-issue.model';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {DragDropService} from './drag-drop.service';

@Injectable({providedIn: 'root'})
export class StoreService {

  private db = inject(IndexedDbService);
  private issueService = inject(GitlabIssuesService);

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

  deleteJourney(journey: UserJourney): void {
    this.db.deleteJourneyCascade(journey.id);
  }

  deleteStep(step: UserStep): void {
    this.db.deleteStepCascade(step.id);
  }

  // HELPER

  determineOrder<T extends { order: number }>(array: T[]): number {
    if (array.length === 0) return 0;
    return Math.max(...array.map(e => e.order)) + 1;
  }

  private sortData<T extends { order: number }>(array: Array<T>) {
    return array.sort((a, b) => a.order - b.order);
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

  transferIssues(item: StepIssue, target: string): void {
    this.db.deleteIssue(item.id)
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
}


