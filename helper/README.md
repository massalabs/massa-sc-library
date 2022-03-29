# Helper

A collection of modules that could be usefull in your Smart Contract journey.

## Result

A result envelope to wrap the returned value of your modules.

### Usage

```typescript
import {result, err, ok} from 'mscl-helper';

function substract(a: number, b: number): result<number, string> {
  return a>b? ok(a-b):err("impossible!");
}
```
