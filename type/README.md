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

<<<<<<< HEAD
More code samples in [Doc tests](address/address.test.ts#L4).
=======
More code samples in [Doc tests](address/address.test.ts).
>>>>>>> b0bc1fa (Adding README file)
