import {StepIssue} from './step-issue';

export interface UserStep {
  id: string;
  title: string;
  order: number;
  journeyId: string;
  issues: Array<StepIssue>;
}
