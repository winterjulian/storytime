import {StepIssue} from './step-issue';

export interface DropCommand {
  type: 'transfer' | 'reorder';
  sourceContainerId: string;
  targetContainerId: string;
  sourceIndex: number;
  targetIndex: number;
  item: StepIssue;
  timestamp: Date;
}
