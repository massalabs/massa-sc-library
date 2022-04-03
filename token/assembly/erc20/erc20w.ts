import {call} from 'massa-sc-std';

export class TokenWrapper {
  origine: string;

  constructor(o: string) {
    this.origine = o;
  }

  name():string {
    return call(this.origine, 'name', 'i', 0);
  }

  balanceOf(a: string):u32 {
    return u32(parseInt(call(this.origine, 'balanceOf', a, 0), 10));
  }
}
