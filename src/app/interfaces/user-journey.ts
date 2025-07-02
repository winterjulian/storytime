import {UserStep} from './user-step';

export interface UserJourney {
  id: string;
  title: string;
  order: number;
  userSteps: Array<UserStep>;
}
