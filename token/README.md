# Standard implementation
Massa's standard implementations of different _classics_.

## Token
Massa's token RFC is [here](M-RFC-Token.md).

To use it, you need to create:
- a _token_ smart contract expending the standard implementation;
- a _caller_ smart contract that will interact with the previous one.

NOTE: a more complex and detailed but also ready to use example can be found in [massa-sc-example repo](https://github.com/massalabs/massa-sc-examples).

### _token_ smart contract example
To expend the standard implementation you can do something like the following:

```ts
export * from '../node_modules/mscl-token/assembly/std/impl';

/**
 * Overwrites `name` function to return wanted value.
 *
 * @param {string} _ - unused but mandatory. See https://github.com/massalabs/massa-sc-std/issues/18
 * @return {string} - the new token name.
 */
export function name(_:string): string {
  return 'Massa Example token';
}
```

### _caller_ smart contract
To interact with this smart contract, you need:
- to ship it to the blockchain ledger;
- to use the wrapper (optional, but makes things easier).

Those two actions can be combined in the same code:

```ts
...
// ships the smart contract to the blockchain ledger
function loadSC(): Address {
  const bytecode = fileToBase64('./build/erc20_create.wasm');
  return createSC(bytecode);
}

export function main(_: string): i32 {
  const scAddress = loadSC();

  //wraps the SC address
  const coin = new TokenWrapper(scAddress);

  //uses a high level function
  const coinName = coin.name();

  print('\n' +
      'Smart contract addess: ' + scAddress.toByteString() + '\n' +
      'Token: ' + coinName);

  return 0;
```

## Non-fungible token
TODO