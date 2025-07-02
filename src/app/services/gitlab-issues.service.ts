import {Injectable} from '@angular/core';
import {StepIssue} from '../interfaces/step-issue';

@Injectable({
  providedIn: 'root',
})
export class GitlabIssuesService {
  private issues: StepIssue[] = [];
  private ids: string[] = [
    '44fcab50-33f4-4584-9a9f-c0ce8cbbeaba',
    '11226296-5855-4a0c-b414-8584cc3cf07f',
    '1207db27-99c8-4afb-800a-c8db2be6278b',
    '042e7720-2b0f-4f89-9642-9c7e7ff42ffa',
    'ccf82854-94f4-482b-a3e4-984b9ee7fbdf',
    '6bf6ac17-9665-41dc-bf6f-0cb07fa98fc1',
    'f6c7458a-15ab-4164-a14f-2c166587dbc7',
    '1390f21f-1f77-4e9b-b4db-3ed41367d60c',
    '18fca88d-cafd-4664-bc6b-95f0e44df574',
    '18f62600-1128-4fce-90ae-ce04d14d24b0',
  ];

  constructor() {
    this.initIssues();
  }

  private initIssues() {
    for (let i = 0; i < this.ids.length; i++) {
      this.issues.push({
        id: this.ids[i],
        title: `Fake Issue #${i + 1}`,
        description: `Description for fake issue #${i + 1}`,
      });
    }
  }

  getIssues(): StepIssue[] {
    return this.issues;
  }
}
