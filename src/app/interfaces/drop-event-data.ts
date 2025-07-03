import {StepIssue} from './step-issue';

export interface DropEventData {
  stepId: string;
  stepIssues: StepIssue[];
}
