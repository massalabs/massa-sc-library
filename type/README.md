# type

A collection of types that could be useful in your AssemblyScript journey.

## Valider

An interface to unify a way of checking if a type is still valid or not.

NOTE: 
- Exception not being an alternative (it stops WebAssembly execution without being catchable);
- `Result` type not being implemented;
then this is the only way to perform an action on a type and check later if the type is still valid.

### Usage

```typescript
import {Valider} from 'mscl-type';

export MyAwesomeType implements Valider {
...
    isValid():bool {
    // check if the type is still valid
    }
}
```

## Currency

A representation of a monetary unit used to express a value.

### Usage

```typescript
import {Currency} from 'mscl-type';

const euro = new Currency("Euro", 2);
const yen = new Currency("Japanese yen", 0);

const isSame = euro.sameAs(yen); // False
```

More code samples in [Doc tests](assembly/__tests__/currency.spec.ts#L3).

## Amount

A representation of a value in a `Currency`. `Amount` implements `Valider` as some operations, such as subtraction,
can result in an invalid `Amount`.

### Usage

```typescript
import {Currency} from 'mscl-type';
import {Amount} from 'mscl-type';

const euro = new Currency("Euro", 2);

const price = new Amount(500, euro);
const accountBalance = new Amount(100, euro);

cont isEnough = price.lessThan(accountBalance); // False

const isValidAmount = accountBalance.substract(price).isValid(); // False
```

More code samples in [Doc tests](assembly/__tests__/amount.spec.ts#L4).
