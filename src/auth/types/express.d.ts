import { User } from '../../user/entities/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}