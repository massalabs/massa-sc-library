import {Sampler} from '../probability/sampler';
/**
 * Changing probability distribution of
 * Sampler class.
 */
class MyDistrib extends Sampler {
  probability(o: u64): f64 {
    return o == 1 ? 1 : 0;
  }
}


describe('Doc test', () => {
  it('should be simple to use', () => {
    const s = new Sampler();

    // sample is determinist thanks to seed setting
    expect<u64>(s.rejection_sampling(10, 1)).toBe(8);
  });

  it('should be simply extended', () => {
    const d = new MyDistrib();

    // sample is determinist because of the retained probability distribution
    expect<u64>(d.rejection_sampling(5, 1)).toBe(1);
    expect<u64>(d.rejection_sampling(5, 1)).toBe(1);
    expect<u64>(d.rejection_sampling(5, 1)).toBe(1);
    expect<u64>(d.rejection_sampling(5, 1)).toBe(1);
  });
});
