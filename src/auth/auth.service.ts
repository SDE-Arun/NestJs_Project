import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  test() {
    console.log('we are just checking the flow');
  }

  signIn() {
    return { msg: 'we are signed in' };
  }
  signUp() {
    return { msg: 'we are signed up' };
  }
}
