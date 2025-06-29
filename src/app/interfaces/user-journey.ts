import {UserStep} from './user-step';

export interface UserJourney {
  id: string;
  title: string;
  userSteps: Array<UserStep>
}
