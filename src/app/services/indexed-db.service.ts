import {Injectable, signal} from '@angular/core';
import {openDB, IDBPDatabase, IDBPTransaction} from 'idb';
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
    console.log('>>> loadAll');
    this.journeys.set(undefined);
    this.steps.set(undefined);
    this.issues.set(undefined);
    this.releases.set(undefined);

    const db = await this.dbPromise;
    this.journeys.set(await db.getAll('journeys'));
    this.steps.set(await db.getAll('steps'));
    this.issues.set(await db.getAll('issues'));
    this.releases.set(await db.getAll('releases'));
  }

  async addJourney(journey: DbUserJourney) {
    const db = await this.dbPromise;
    await db.put('journeys', journey);
    // this.journeys.update(list => (list ? [...list, journey] : [journey]));
    this.loadAll();
  }

  async addStep(step: DbUserStep) {
    const db = await this.dbPromise;
    await db.put('steps', step);
    // this.steps.update(list => (list ? [...list, step] : [step]));
  }

  async addIssue(issue: DbStepIssue) {
    const db = await this.dbPromise;
    await db.put('issues', issue);
    // this.issues.update(list => (list ? [...list, issue] : [issue]));
  }

  async deleteIssue(id: string) {
    const db = await this.dbPromise;
    await db.delete('issues', id);
    // this.issues.update(list => (list ? list.filter(i => i.id !== id) : []));
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
    const tx = db.transaction(['journeys', 'steps', 'issues'] as const, 'readwrite');
    // "as const" => bc TypeScript can t guarantee that array contains expected strings
    await tx.objectStore('journeys').delete(journeyId);

    const stepsStore = tx.objectStore('steps');
    const allSteps = await stepsStore.getAll();
    const stepsToDelete = allSteps.filter(step => step.journeyId === journeyId);

    if (!stepsToDelete.length) {
      this.loadAll();
    }

    // for (const step of stepsToDelete) {
    //   await this.deleteStepCascade(step.id, tx);
    // }
    // problem: tx might be already inactive bc done even though loop is still running, changing to Promise.all
    await Promise.all(
      stepsToDelete.map(step => this.deleteStepCascade(step.id, tx))
    );
    await tx.done;
  }

  async deleteStepCascade(
    stepId: string,
    tx?: IDBPTransaction<
      DBSchema,
      ['steps', 'issues'] | ['journeys', 'steps', 'issues'],
      'readwrite'
    >
  ) {
    const db = await this.dbPromise;

    const localTx = tx ?? db.transaction(['steps', 'issues'] as const, 'readwrite');
    const stepsStore = localTx.objectStore('steps');
    const issuesStore = localTx.objectStore('issues');

    await stepsStore.delete(stepId);

    const allIssues = await issuesStore.getAll();
    const issuesToDelete = allIssues.filter(issue => issue.stepId === stepId);
    for (const issue of issuesToDelete) {
      await issuesStore.delete(issue.id);
    }

    await localTx.done;
    this.loadAll();
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
