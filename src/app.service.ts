import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(id: number): string {
    if (id === 1) {
      return 'Your id is one';
    }
    if (id === 2) {
      return 'Wrong id';
    }
  }
}
