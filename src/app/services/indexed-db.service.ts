import {Injectable, signal} from '@angular/core';
import {openDB, IDBPDatabase} from 'idb';
import {DbUserJourney} from './models/db-user-journey.model';
import {DbUserStep} from './models/db-user-step.model';
import {DbStepIssue} from './models/db-step-issue.model';
import {DbRelease} from './models/db-release.model';

type DBSchema = {
  journeys: DbUserJourney;
  steps: DbUserStep;
  issues: DbStepIssue;
  releases: DbRelease;
};

@Injectable({providedIn: 'root'})
export class IndexedDbService {
  private dbPromise: Promise<IDBPDatabase<DBSchema>>;

  journeys = signal<DbUserJourney[] | undefined>(undefined);
  steps = signal<DbUserStep[] | undefined>(undefined);
  issues = signal<DbStepIssue[] | undefined>(undefined);
  releases = signal<DbRelease[] | undefined>(undefined);

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
    console.log('loadAll');
    this.journeys.set(undefined);
    this.steps.set(undefined);
    this.issues.set(undefined);
    this.releases.set(undefined);

    const db = await this.dbPromise;
    this.journeys.set(await db.getAll('journeys'));
    this.steps.set(await db.getAll('steps'));
    this.issues.set(await db.getAll('issues'));
    this.releases.set(await db.getAll('releases'));

    console.log(this.journeys());
    console.log(this.steps());
  }

  async addJourney(journey: DbUserJourney) {
    const db = await this.dbPromise;
    await db.put('journeys', journey);
    this.journeys.update(list => (list ? [...list, journey] : [journey]));
  }

  async addStep(step: DbUserStep) {
    const db = await this.dbPromise;
    await db.put('steps', step);
    this.steps.update(list => (list ? [...list, step] : [step]));
  }

  async addIssue(issue: DbStepIssue) {
    console.log('>>> addIssue');
    const db = await this.dbPromise;
    await db.put('issues', issue);
    this.issues.update(list => (list ? [...list, issue] : [issue]));
  }

  async deleteIssue(id: string) {
    console.log('>>> deleteIssue');
    const db = await this.dbPromise;
    await db.delete('issues', id);
    this.issues.update(list => (list ? list.filter(i => i.id !== id) : []));
  }

  async assignIssueToRelease(issueId: string, releaseId: string) {
    const db = await this.dbPromise;
    const issue = await db.get('issues', issueId);
    if (issue) {
      issue.releaseId = releaseId;
      await db.put('issues', issue);
      this.issues.update(list =>
        list ? list.map(i => (i.id === issueId ? {...i, releaseId} : i)) : []
      );
    }
  }

  async deleteJourneyCascade(journeyId: string) {
    const db = await this.dbPromise;
    const tx = db.transaction(['journeys', 'steps', 'issues'], 'readwrite');

    // Journey löschen
    await tx.objectStore('journeys').delete(journeyId);

    // Steps laden, die zu dieser Journey gehören
    const stepsStore = tx.objectStore('steps');
    const allSteps = await stepsStore.getAll();
    const stepsToDelete = allSteps.filter(step => step.journeyId === journeyId);

    // Issues-Store
    const issuesStore = tx.objectStore('issues');

    // Alle passenden Steps + ihre Issues löschen
    for (const step of stepsToDelete) {
      // Step löschen
      await stepsStore.delete(step.id);

      // Issues dieses Steps löschen
      const allIssues = await issuesStore.getAll();
      const issuesToDelete = allIssues.filter(issue => issue.stepId === step.id);
      for (const issue of issuesToDelete) {
        await issuesStore.delete(issue.id);
      }
    }

    await tx.done;

    this.journeys.update(list => list?.filter(j => j.id !== journeyId) ?? []);
    this.steps.update(list => list?.filter(s => s.journeyId !== journeyId) ?? []);
    this.issues.update(list => list?.filter(i => !stepsToDelete.some(s => s.id === i.stepId)) ?? []);
  }

  async removeIssueFromRelease(issueId: string) {
    const db = await this.dbPromise;
    const issue = await db.get('issues', issueId);
    if (issue) {
      issue.releaseId = undefined;
      await db.put('issues', issue);
      this.issues.update(list =>
        list ? list.map(i => (i.id === issueId ? {...i, releaseId: undefined} : i)) : []
      );
    }
  }

  async addRelease(release: DbRelease) {
    const db = await this.dbPromise;
    await db.put('releases', release);
    this.releases.update(list => (list ? [...list, release] : [release]));
  }

  async deleteRelease(id: string) {
    const db = await this.dbPromise;
    await db.delete('releases', id);
    this.releases.update(list => (list ? list.filter(r => r.id !== id) : []));

    // Alle Issues, die dieses Release hatten, davon lösen
    this.issues.update(list =>
      list
        ? list.map(issue =>
          issue.releaseId === id ? {...issue, releaseId: undefined} : issue
        )
        : []
    );
  }

  async deleteJourney(journeyId: string) {
    const db = await this.dbPromise;

    await db.delete('journeys', journeyId);
    this.journeys.update(list => (list ? list.filter(j => j.id !== journeyId) : []));

    const stepsToDelete = (this.steps() ?? []).filter(step => step.journeyId === journeyId);

    for (const step of stepsToDelete) {
      await this.deleteStep(step.id);
    }

    this.loadAll();
  }

  async deleteStep(stepId: string) {
    const db = await this.dbPromise;

    await db.delete('steps', stepId);
    this.steps.update(list => (list ? list.filter(s => s.id !== stepId) : []));

    const issuesToNeutralize = (this.issues() ?? []).filter(issue => issue.stepId === stepId);

    // neutralize = set step and release ids to undefined
    for (const issue of issuesToNeutralize) {
      const updatedIssue = {...issue, stepId: undefined, releaseId: undefined};
      await db.put('issues', updatedIssue);
    }
  }

  async clearDatabaseCompletely() {
    // Erst die DB-Instanz sicher schließen, falls offen (optional)
    const dbName = 'UserStoryMapDB';

    return new Promise<void>((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(dbName);
      deleteRequest.onsuccess = () => {
        console.log('IndexedDB komplett gelöscht');
        resolve();
      };
      deleteRequest.onerror = () => {
        console.error('Fehler beim Löschen der IndexedDB');
        reject(deleteRequest.error);
      };
      deleteRequest.onblocked = () => {
        console.warn('Löschung der IndexedDB blockiert');
      };
    });
  }
}
