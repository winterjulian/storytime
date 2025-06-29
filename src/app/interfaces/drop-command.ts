import {Issue} from './issue';

export interface DropCommand {
  type: 'transfer' | 'reorder';
  sourceContainerId: string;
  targetContainerId: string;
  sourceIndex: number;
  targetIndex: number;
  item: Issue;
  timestamp: Date;
}
