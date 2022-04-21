# helper

A collection of helpers that could be useful in your AssemblyScript journey.

## Probability

### Random

AssemblyScript propose [an unsafe random function](https://www.assemblyscript.org/stdlib/math.html#functions). The underlying uniform distribution can be seeded using [`Math.seedRandom`](https://github.com/AssemblyScript/assemblyscript/issues/140#issuecomment-398380627) function.

Additionally, this module exposes the `randomInt` function to draw numbers in a given range.

#### Usage

```typescript
import {randomInt} from 'mscl-helper/probability';

const r = randomInt(0, 5); // 0 <= r <= 5
```

More code samples in [Doc tests](assembly/__tests__/random.spec.ts#L3).

### Combinatoric

A set of useful combinatorial functions such:

- [Combination](https://en.wikipedia.org/wiki/Combination)
- [Partial permutation](https://en.wikipedia.org/wiki/Partial_permutation)
- [Factorial](https://en.wikipedia.org/wiki/Factorial)

#### Usage

```typescript
import {factorial, partialPermutation, combination} from 'mscl-helper/probability/combinatoric'

let v = factorial(5); // 120
v = partialPermutation(4, 3); //24
v = combination(10, 7); //120
```

More code samples in [Doc tests](assembly/__tests__/combinatoric.spec.ts#L3).

### Drawing numbers from custom distributions

Returns observation from a custom distribution instead of a uniform one (Math.random or randomInt).

#### Usage

```typescript
import {Binomial} from 'mscl-helper/probability/binomial';

const g = new Binomial(20, 0.5);
const r = g.draw(); // an observation from binomial distribution having 0.5 as the probability of successes in a sequence of 20 independent experiments.
```


```typescript
class MyWeightedProbability extends Sampler {

  p: Map<u64, f64>; // Weighted probability

  constructor() {
    super();
    
    // Custom probability initialization
    this.p = new Map<u64, f64>();
    this.p.set(0, 0.05);
    this.p.set(1, 0.1);
    this.p.set(2, 0.3);
    this.p.set(3, 0.9);
    this.p.set(4, 0.07);
  }

  // This function will be called by inverseCumulativeDistribution implemented in Sampler
  probability(o: u64): f64 {
    return this.p[o];
  }

  draw(): u64 {
    return this.inverseCumulativeDistribution(4);
  }
}

const d = new MyWeightedProbability();

const r = d.draw(); // a random value between 0 and 4 based on MyWeightedProbability.p probability.
```
