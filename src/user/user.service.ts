import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getAllUsers() {
    return [
      { id: 1, name: 'Ada' },
      { id: 2, name: 'Emeka' },
    ];
  }
}
