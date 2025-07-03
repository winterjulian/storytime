import {StepIssue} from './step-issue';

export interface DropCommand {
  type: 'transfer' | 'reorder';
  sourceStepId: string;
  targetStepId: string;
  sourceContainerId: string;
  targetContainerId: string;
  sourceIndex: number;
  targetIndex: number;
  item: StepIssue;
}
