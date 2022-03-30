import {call} from 'massa-sc-std';

export class TokenWrapper {
  origine: string;

  constructor(o: string) {
    this.origine = o;
  }

  Name():string {
    return call(this.origine, 'Name', '', 0);
  }

  BalanceOf(a: string):u32 {
    return u32(parseInt(call(this.origine, 'BalanceOf', a, 0), 10));
  }
}
