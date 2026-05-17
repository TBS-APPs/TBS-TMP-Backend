import { User } from '../../user/entities/user.entity';

export interface AuthResponseData {
  user: User;
  access_token: string;
}
