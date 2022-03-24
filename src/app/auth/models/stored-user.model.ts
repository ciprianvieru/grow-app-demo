import { User } from './user.model';

export interface StoredUser extends User {
  password: string;
}
