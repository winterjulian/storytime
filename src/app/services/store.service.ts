import {signal, inject, Injectable, effect, linkedSignal} from '@angular/core';
import {UserJourney} from '../interfaces/user-journey';
import {UserStep} from '../interfaces/user-step';
import {StepIssue} from '../interfaces/step-issue';
import {FormGroup} from '@angular/forms';
import {IndexedDbService} from './indexed-db.service';
import {GitlabIssuesService} from './gitlab-issues.service';
import {DbStepIssue} from './models/db-step-issue.model';
import {Release} from '../interfaces/release';

@Injectable({providedIn: 'root'})
export class StoreService {
  private db = inject(IndexedDbService);
  private gitlabIssuesService = inject(GitlabIssuesService);

  public containerMap = new Map<string, StepIssue[]>();
  private _userJourneys = signal<UserJourney[]>([]);
  public userJourneys = this._userJourneys.asReadonly();
  public gitlabIssues = linkedSignal(() => {
    const dbIssues = this.db.issues();
    if (!dbIssues) return [];

    const gitlabAll = this.gitlabIssuesService.getIssues();
    return this.filterGitlabIssues(dbIssues, gitlabAll);
  });
  public releases = signal<Array<Release>>([]);

  constructor() {
    this.loadUserJourneysFromDb();

    effect(() => {
      const journeys = this.db.journeys();
      const steps = this.db.steps();
      const issues = this.db.issues();

      if (journeys && steps && issues) {
        this.loadUserJourneysFromDb();
      }
    });
  }

  private loadUserJourneysFromDb() {
    const journeys = this.db.journeys();
    const steps = this.db.steps();
    const issues = this.db.issues();

    if (!journeys || !steps || !issues) {
      this._userJourneys.set([]);
      return;
    }

    // sorting data here, indexedDB too complicated for easy stuff like that
    this.sortData(journeys);

    const result = journeys.map(journey => {
      const userSteps = this.sortData(
        steps
          .filter(step => step.journeyId === journey.id)
          .map(step => {
            const stepIssues = issues.filter(issue => issue.stepId === step.id);
            this.registerContainerReference('drop-' + journey.id + '-' + step.id, stepIssues);
            return {
              ...step,
              issues: stepIssues,
            };
          })
      );
      return {
        ...journey,
        userSteps,
      };
    });

    this._userJourneys.set(result);
  }

  public setUserJourneys(journeys: UserJourney[]) {
    this._userJourneys.set(journeys);
  }

  private filterGitlabIssues(dbIssues: DbStepIssue[], gitlabAll: StepIssue[]): StepIssue[] {
    const dbIssueIds = new Set(dbIssues.map(i => i.id));
    return gitlabAll.filter(issue => !dbIssueIds.has(issue.id));
  }

  refreshGitlabIssues() {
    const filtered = this.filterGitlabIssues(this.db.issues() ?? [], this.gitlabIssuesService.getIssues());
    this.gitlabIssues.set(filtered);
  }

  public createUserJourney(form: FormGroup, key: string) {
    const title = form.controls[key]?.value;
    const newJourney: UserJourney = {
      id: this.getRandomId(),
      title,
      order: this.determineOrder(this._userJourneys()),
      userSteps: [],
    };

    this._userJourneys.update(journeys => [...journeys, newJourney]);

    this.db.addJourney(newJourney);
  }

  public deleteJourney(journey: UserJourney): void {
    this.db.deleteJourneyCascade(journey.id);
    // reloading issues after deletion (clean issue situation)
    this.db.loadIssues();
    journey.userSteps.forEach((userStep: UserStep) => {
      this.deleteStepFromJourney(userStep);
    })
    this._userJourneys.update(journeys =>
      journeys.filter(j => j.id !== journey.id)
    );
  }

  public createUserJourneyStep(
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

    this._userJourneys.update(journeys =>
      journeys.map(j =>
        j.id === journey.id
          ? {...j, userSteps: [...j.userSteps, newUserStep]}
          : j
      )
    );

    this.db.addStep(newUserStep);
  }

  public deleteStep(step: UserStep): void {
    this.db.deleteStepCascade(step.id);
    // reloading issues after deletion (clean issue situation)
    this.db.loadIssues();
    this.refreshGitlabIssues();
    this.deleteStepFromJourney(step);
  }

  private deleteStepFromJourney(step: UserStep) {
    this._userJourneys.update(journeys =>
      journeys.map(j => ({
        ...j,
        userSteps: j.userSteps.filter(s => s.id !== step.id),
      }))
    );
  }

  public transferIssues(item: StepIssue, target: string): void {
    this.db.deleteIssue(item.id);
    if (target !== 'issue-list') {
      this.db.addIssue({...item, stepId: target});
    }
  }

  public purgeDb() {
    this.db.clearDatabaseCompletely();
    this._userJourneys.set([]);
  }

  // ====================
  // CONTAINER REFERENCES
  // ====================

  public registerContainerReference(id: string, array: StepIssue[]) {
    this.containerMap.set(id, array);
  }

  public removeContainerMapReferencesByJourney(journey: UserJourney): void {
    journey.userSteps.forEach((step) => {
      this.removeContainerMapReferencesByStep(step, journey.id)
    })
  }

  public removeContainerMapReferencesByStep(step: UserStep, journeyOrReleaseId: string): void {
    const id = 'drop-' + journeyOrReleaseId + '-' + step.id
    this.containerMap.delete(id);
  }

  // =======
  // HELPERS
  // =======

  private determineOrder<T extends { order: number }>(array: T[]): number {
    if (array.length === 0) return 0;
    return Math.max(...array.map(e => e.order)) + 1;
  }

  private sortData<T extends { order: number }>(array: Array<T>): Array<T> {
    return array.sort((a, b) => a.order - b.order);
  }

  private getRandomId(): string {
    return crypto.randomUUID();
  }
}
