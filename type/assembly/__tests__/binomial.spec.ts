import {Binomial} from '../probability/binomial';

describe('Doc test', () => {
  it('should be simple to use', () => {
    const g = new Binomial(20, 0.5);

    const r = g.draw(); // observation from binomial distribution

    expect<u64>(r).toBeLessThanOrEqual(20);
    expect<u64>(r).toBeGreaterThanOrEqual(0);
  });
});


describe('Blackbox test', () => {
  // slow
  xtest('binomial distribution', () => {
    const a = new Uint32Array(20);
    const g = new Binomial(20, 0.5);

    for (let i=0; i<a.length; i++) {
      a[i] = 0;
    }

    for (let i=0; i<10000000; i++) {
      const s = g.draw();
      a[u32(s)] +=1;
    }

    for (let i=0; i<a.length; i++) {
      log<u32>(a[i]);
    }
  });
});
