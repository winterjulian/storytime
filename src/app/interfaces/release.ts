import {StepIssue} from './step-issue';

export interface Release {
  id: string,
  title: string,
  issues: Array<StepIssue>
}
