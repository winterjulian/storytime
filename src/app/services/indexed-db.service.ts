import {Injectable, signal} from '@angular/core';
import {openDB, IDBPDatabase} from 'idb';
import {Journey} from './models/journey.model';
import {Step} from './models/step.model';
import {Issue} from './models/issue.model';
import {Release} from './models/release.model';

type DBSchema = {
  journeys: Journey;
  steps: Step;
  issues: Issue;
  releases: Release;
};

@Injectable({providedIn: 'root'})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<DBSchema>>;

  journeys = signal<Journey[]>([]);
  steps = signal<Step[]>([]);
  issues = signal<Issue[]>([]);
  releases = signal<Release[]>([]);

  constructor() {
    this.dbPromise = this.initDB();
    this.loadAll();
  }

  private async initDB() {
    return await openDB<DBSchema>('UserStoryMapDB', 1, {
      upgrade(db) {
        db.createObjectStore('journeys', {keyPath: 'id'});
        db.createObjectStore('steps', {keyPath: 'id'});
        db.createObjectStore('issues', {keyPath: 'id'});
        db.createObjectStore('releases', {keyPath: 'id'});
      },
    });
  }

  async loadAll() {
    const db = await this.dbPromise;
    this.journeys.set(await db.getAll('journeys'));
    this.steps.set(await db.getAll('steps'));
    this.issues.set(await db.getAll('issues'));
    this.releases.set(await db.getAll('releases'));

    console.log(this.journeys());
    console.log(this.steps());
  }

  async addJourney(journey: Journey) {
    const db = await this.dbPromise;
    await db.put('journeys', journey);
    this.journeys.update(list => [...list, journey]);
  }

  async addStep(step: Step) {
    const db = await this.dbPromise;
    await db.put('steps', step);
    this.steps.update(list => [...list, step]);
  }

  async addIssue(issue: Issue) {
    const db = await this.dbPromise;
    await db.put('issues', issue);
    this.issues.update(list => [...list, issue]);
  }

  async deleteIssue(id: string) {
    const db = await this.dbPromise;
    await db.delete('issues', id);
    this.issues.update(list => list.filter(i => i.id !== id));
  }

  async assignIssueToRelease(issueId: string, releaseId: string) {
    const db = await this.dbPromise;
    const issue = await db.get('issues', issueId);
    if (issue) {
      issue.releaseId = releaseId;
      await db.put('issues', issue);
      this.issues.update(list =>
        list.map(i => (i.id === issueId ? {...i, releaseId} : i))
      );
    }
  }

  async removeIssueFromRelease(issueId: string) {
    const db = await this.dbPromise;
    const issue = await db.get('issues', issueId);
    if (issue) {
      issue.releaseId = undefined;
      await db.put('issues', issue);
      this.issues.update(list =>
        list.map(i => (i.id === issueId ? {...i, releaseId: undefined} : i))
      );
    }
  }

  async addRelease(release: Release) {
    const db = await this.dbPromise;
    await db.put('releases', release);
    this.releases.update(list => [...list, release]);
  }

  async deleteRelease(id: string) {
    const db = await this.dbPromise;
    await db.delete('releases', id);
    this.releases.update(list => list.filter(r => r.id !== id));

    // Alle Issues, die dieses Release hatten, davon lösen
    this.issues.update(list =>
      list.map(issue =>
        issue.releaseId === id ? {...issue, releaseId: undefined} : issue
      )
    );
  }

  // retry creating delete functions <.<
  async deleteJourney(journeyId: string) {
    const db = await this.dbPromise;

    await db.delete('journeys', journeyId);
    this.journeys.update(list => list.filter(j => j.id !== journeyId));

    const stepsToDelete = this.steps().filter(step => step.journeyId === journeyId);

    for (const step of stepsToDelete) {
      await this.deleteStep(step.id);
    }
  }

  async deleteStep(stepId: string) {
    const db = await this.dbPromise;

    await db.delete('steps', stepId);
    this.steps.update(list => list.filter(s => s.id !== stepId));

    const issuesToNeutralize = this.issues().filter(issue => issue.stepId === stepId);

    // neutralize = set step and release ids to undefined
    for (const issue of issuesToNeutralize) {
      const updatedIssue = {...issue, stepId: undefined, releaseId: undefined};
      await db.put('issues', updatedIssue);
    }
  }
}
