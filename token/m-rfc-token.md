# M-RFC-Token
Massa's standard interface for token.

Status: WIP.

## Introduction

### Abstract
This memo provides Massa's interface definition of a token, a set of basic functionalities on token accounts to transfer coins and to manage allowance.


### Differences with ERC-20
This RFC is largely inspired by _"EIP-20: Token Standard," Ethereum Improvement Proposals, no. 20, November 2015_
with the notable exception of:

- Getter functions (`name`, `symbol`...) are mandatory.
- `decimals` function is absent, `amount` type usage makes it useless.
- `approve` function is replaced by `increaseAllowance` and `decreaseAllowance`.

## Context and motivation
_TODO_

## Specification
The following section considers an AssemblyScript implementation.

### Interface
A smart contract implementing Massa RFC 20 interface must have the following exported functions:

```js
export function name(): string
export function symbol(): string
export function totalSupply(): u64
export function balanceOf(a: address): amount
export function transfer(to: address, value: amount): bool
export function transferFrom(from: address, to: address, value: amount): bool
export function increaseAllowance(a: address, value: amount): bool
export function decreaseAllowance(a: address, value: amount): bool
export function allowance(o: address, s: address): amount
```

### Simple getters

#### Name
Returns the name of the token.

#### Symbol
Returns the symbol of the token.

#### Decimals => to remove ?
Returns token precision, the maximal number of digits after the decimal separator that are used to express the value.

#### Total supply
Returns the current number minted coins.

#### Balance of
Returns the number of coins deposited at the given address account.

### Operation functions

#### Transfer
Moves the number of coins (`value` field) from the caller's account to the recipient address account (`to` field).

#### Allowance mechanism
A number of coins that can be spent by a user on behalf of the owner for a specific purpose.

##### Set allowance
To change allowance value, you can use:
- `increaseAllowance` to increase the number of coins;
- `decreaseAllowance` to decrease the number of coins.

The address (`a` field) identifies the user that can spend the coins and the amount (field `value`) is used to increase or decrease allowance.

Note: Only the owner of the coins can set or update the allowance. Hence, no owner parameter is passed to these functions.

##### Allowance
Returns the amount (number of coins) that a user can spend on behalf of the owner.

The owner (`o` field) and the spender (`s` field) are both identified by their addresses.

##### Transfer from
Moves the amount (number of coins set in `value` field) from the owner's account (`from` field) to the recipient's account (`to` field) using the allowance mechanism.

Accounts are identified by their addresses.

Note: Only the owner of the allowance can call this function. Hence, no spender parameter is passed to this function.

### Binding
TODO

## Security consideration
TODO
