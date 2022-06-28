# M-RFC-Token
The Massa's standard interface for token.

Status: WIP.

## Introduction

### Abstract
This memo provides Massa's interface definition of a token, a set of basic functionalities on token accounts to transfer coins and to manage allowance.


### Differences with ERC-20
This RFC is largely inspired by _"EIP-20: Token Standard," Ethereum Improvement Proposals, no. 20, November 2015_
with the notable exception of:

- Getter functions (`name`, `symbol`...) are mandatory.
- `decimals` function is absent, the `amount` type usage makes it useless.
- `approve` function is replaced by `increaseAllowance` and `decreaseAllowance` for security reasons.

## Context and motivation
_TODO_

## Specification
The following section considers an AssemblyScript implementation.

### Interface
A smart contract implementing Massa's standard interface for token interface must have the following exposed functions:

```js
function version(): string
function name(): string
function symbol(): string
function totalSupply(): amount

function balanceOf(a: address): amount
function transfer(toAccount: Address, nbTokens: Amount): boolean

function allowance(ownerAccount: Address, ownerAccount: Address): Amount
function increaseAllowance(spenderAccount: Address, nbTokens: Amount): boolean
function decreaseAllowance(spenderAccount: Address, nbTokens: Amount): boolean
function transferFrom(ownerAccount: Address, recipientAccount: Address, nbTokens: Amount): boolean
```
### Simple getters

#### Name
Returns the name of the token.
#### Symbol
Returns the symbol of the token.
#### Total supply
Returns the current number of minted coins.
#### Balance of
Returns the number of coins deposited at the given address account.

### Operation functions

#### Transfer
Moves the number of coins (`nbTokens` field) from the caller's account to the recipient's account (`toAccount` field).

#### Allowance mechanism
A number of coins that can be spent by a user on behalf of their owner for a specific purpose.

##### Allowance
Returns the amount (number of coins) that a user can spend on behalf of the owner.
The owner (`ownerAccount` field) and the spender (`ownerAccount` field) are both identified by their addresses.

##### Set allowance
To change the allowance value, you can use:
- `increaseAllowance` to increase the number of allowed coins;
- `decreaseAllowance` to decrease the number of allowed coins.
The spender account (`spenderAccount` field) identifies the user that can spend the coins and the amount (field `nbTokens`) is used to increase or decrease allowance.

Note: Only the owner of the coins can set or update the allowance. Hence, no owner parameter is passed to these functions.

##### Transfer from
Moves the number of coins (`nbTokens` field) from the owner's account (`ownerAccount` field) to the recipient's account (`recipientAccount` field) using the allowance mechanism.

Note: Only the spender of the allowance can call this function. Hence, no spenderAccount parameter is passed to this function.

### Bridging
Smart contracts being run in different WebAssembly modules, calling one function contained in a remote smart contract needs to use the foreign function interface, [FFI](https://en.wikipedia.org/wiki/Foreign_function_interface), mechanism.

To simplify the bridging logic, the smart contract creator must propose a _wrapper_ to interact with the remote smart contract. Furthermore, the described [interface](#interface) must be implemented at the wrapper level.

The standard implementation is also following this principle:
- the smart contract content is in the [implementation](assembly/std/impl.ts) file;
- the bridging logic is in the [wrapper](assembly/std/wrapper.ts) file.

## Security consideration
TODO