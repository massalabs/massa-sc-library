# Type

A collection of modules that could be useful in your Smart Contract journey.

## Address

A representation of Massa blockchain address.

### Usage

```typescript
import {Address} from 'mscl-type';
import {isOk, err} from 'mscl-helper'


function transfer(to: string, a: number): result<boolean, string> {
  const r = new Address().from(to);
  if (!isOk(r)) {
    return err("invalid address:" + r.data);
  }
  const addr = r.data;
  //to be continued...
}
```

More code samples in [Doc tests](address/address.test.ts).
