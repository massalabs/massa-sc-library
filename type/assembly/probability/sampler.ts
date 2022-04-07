import {randomInt} from './random';


/**
 * Generates samples based on a probability distribution.
 *
 * This class shall be extended with your own probability.
 */
export class Sampler {
  /**
     * Instanciates a sampler.
     *
     * This constructor calls seedRandom.
     *
     * @param {u64} s - seed for random Math.random function.
     */
  constructor(s:u64=0) {
    Math.seedRandom(s);
  }

  /**
     * Returns the probability of given sample.
     *
     * Probability function doesn't need to be normalized,
     * but the greatest probability of the distribution must be knowned.
     *
     * @param{u64} _ - sample.
     * @return {f64}
     */
  probability(_: u64): f64 {
    return 1;
  }

  /**
     * Generates an observation from given distribution.
     *
     * @param {u64} n - sampling upper limit
     * @param {f32} max - greatest probability of the distribution
     * @return {u64}
     */
  rejection_sampling(n: u64, max: f32):u64 {
    while (true) {
      const k = randomInt(0, n-1);
      const x = Math.random()*max;
      if (x <= this.probability(k)) {
        return k;
      }
    }
  }
}
