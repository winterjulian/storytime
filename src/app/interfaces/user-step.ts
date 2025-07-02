import {StepIssue} from './step-issue';

export interface UserStep {
  id: string;
  title: string;
  issues: Array<StepIssue>;
}
