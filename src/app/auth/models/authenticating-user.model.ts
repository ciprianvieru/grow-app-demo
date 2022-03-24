import { User } from './user.model';

export interface AuthenticatingUser extends User {
  password: string;
}
