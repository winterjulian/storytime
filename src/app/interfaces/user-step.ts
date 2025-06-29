import {Issue} from './issue';

export interface UserStep {
  id: string;
  title: string;
  issues: Array<Issue>;
}
