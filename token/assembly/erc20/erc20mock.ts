/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import {Storage} from 'massa-sc-std';
import {SetAllowanceArgs, TransferArgs} from './args';
import {Address} from '../../node_modules/mscl-type/assembly/address';
import {Amount} from '../../node_modules/mscl-type/assembly/amount';

import * as Erc20 from './erc20';

export {ALLOWANCE_KEY_PRAEFIX, APPROVAL_EVENT_NAME, BALANCE_KEY_PRAEFIX, TRANSFER_EVENT_NAME} from './erc20';

// ================================================================= //
// ====================BASIC OVERWRITABLE METHODS=================== //
// ================================================================= //

/**
 * Returns the name of the token.
 *
 * @return {string} token name.
 */
export function name(): string {
  return 'Massa ERC20 Token';
}

/** Returns the symbol of the token.
 *
 * @return {string} token symbol.
 */
export function symbol(): string {
  return 'MET';
}

/**
 * Returns the total token supply.
 *
 * Number of tokens that were initially minted.
 *
 * @return {u64} number of minted tokens.
 */
export function totalSupply(): u64 {
  return 10000;
}

// ==================================================== //
// ==================== BALANCE ======================= //
// ==================================================== //

/**
 * Returns the balance of a given address.
 *
 * @param {string} args - serialized class instance of type Address
 *
 * @return {string} serialized amount for that address.
 */
export function balanceOf(args: string): string {
  return Erc20.balanceOf(args);
}

// ==================================================== //
// ==================== ALLOWANCE ===================== //
// ==================================================== //

/**
 * Sets the allowance of a given address.
 *
 * @param {string} sender - Sender address
 * @param {string} args - serialized class instance of type SetAllowanceArgs
 *
 * @return {boolean} true on success
 */
export function approve(sender: string, args: string): boolean {
  const ownerAddress = new Address(sender);
  const parsedArgs = SetAllowanceArgs.deserializeFromStr(args);
  assert(ownerAddress.isValid(), 'Bad owner address format');
  assert(parsedArgs.spender().isValid(), 'Bad spender address format');
  assert(parsedArgs.amount().isValid(), 'Bad approval amount format');
  _approve(ownerAddress, parsedArgs.spender(), parsedArgs.amount());
  return true;
}

/**
 * Returns the allowance of a given address.
 *
 * @param {string} args - serialized class instance of type GetAllowanceArgs
 *
 * @return {string} serialized allowance for that address.
 */
export function allowance(args: string): string {
  return Erc20.allowance(args);
}

/**
 * Increases the allowance of a given spender address.
 *
 * @param {string} sender - Sender address
 * @param {string} args - serialized class instance of type ChangeAllowanceArgs
 *
 * @return {boolean} true on success
 */
export function increaseAllowance(sender: string, args: string): boolean {
  const ownerAddress = new Address(sender);
  const parsedArgs = SetAllowanceArgs.deserializeFromStr(args);
  assert(ownerAddress.isValid(), 'Bad owner address format');
  assert(parsedArgs.spender().isValid(), 'Bad spender address format');
  assert(parsedArgs.amount().isValid(), 'Bad approval amount format');
  const currentSpenderAllowance: Amount = _allowance(ownerAddress, parsedArgs.spender());
  const newIncreasedAllowance: Amount = currentSpenderAllowance.add(parsedArgs.amount());
  assert(newIncreasedAllowance.isValid(), 'Overflowed spender allowance');
  _approve(ownerAddress, parsedArgs.spender(), newIncreasedAllowance);
  return true;
}

/**
 * Decreases the allowance of a given spender address.
 *
 * @param {string} sender - Sender address
 * @param {string} args - serialized class instance of type ChangeAllowanceArgs
 *
 * @return {boolean} true on success
 */
export function decreaseAllowance(sender: string, args: string): boolean {
  const ownerAddress = new Address(sender);
  const parsedArgs = SetAllowanceArgs.deserializeFromStr(args);
  assert(ownerAddress.isValid(), 'Bad owner address format');
  assert(parsedArgs.spender().isValid(), 'Bad spender address format');
  assert(parsedArgs.amount().isValid(), 'Bad approval amount format');
  const currentSpenderAllowance: Amount = _allowance(ownerAddress, parsedArgs.spender());
  const newDecreasedAllowance: Amount = currentSpenderAllowance.substract(parsedArgs.amount());
  assert(newDecreasedAllowance.isValid(), 'Underflowed spender allowance');
  _approve(ownerAddress, parsedArgs.spender(), newDecreasedAllowance);
  return true;
}

// ==================================================== //
// ==================== TRANSFER ===================== //
// ==================================================== //

/**
 * Function to transfer token ownership to one account on behalf of another.
 *
 * @param {string} sender - Sender address
 * @param {string} args - serialized class instance of type TransferFromArgs
 *
 * @return {boolean} true on success
 */
export function transfer(sender: string, args: string): boolean {
  const fromAddress = new Address(sender);
  const parsedArgs = TransferArgs.deserializeFromStr(args);
  assert(fromAddress.isValid(), 'Bad from address format');
  assert(parsedArgs.to().isValid(), 'Bad to address format');
  assert(parsedArgs.amount().isValid(), 'Bad transfer amount format');
  const currentSenderBalance: Amount = _getBalance(fromAddress);
  assert(parsedArgs.amount().lessThan(currentSenderBalance), 'Insufficient balance');
  _transfer(fromAddress, parsedArgs.to(), parsedArgs.amount());
  return true;
}

/**
 * Function to transfer token ownership to one account on behalf of another.
 *
 * @param {string} args - serialized class instance of type TransferFromArgs
 *
 * @return {boolean} true on success
 */
export function transferFrom(args: string): boolean {
  return Erc20.transferFrom(args);
}

// ==================================================== //
// ================ INTERNAL FUNCTIONS ================ //
// ==================================================== //

/**
 * Internal function that sets a balance to an address
 *
 * @param {Address} from - sender address
 * @param {Address} to - receiver address
 * @param {Amount} amount - amount to transfer
 *
 */
function _transfer(from: Address, to: Address, amount: Amount): void {
  let fromBalance = _getBalance(from);
  let toBalance = _getBalance(to);
  assert<bool>(amount.lessThan(fromBalance), 'Transfer amount exceeds balance');
  fromBalance = fromBalance.substract(amount);
  _setBalance(from, fromBalance);
  toBalance = toBalance.add(amount);
  _setBalance(to, toBalance);
}

/**
 * Internal function that sets a balance to an address
 *
 * @param {Address} address - address to set the balance for
 * @param {Amount} balance - balance to set
 *
 */
function _setBalance(address: Address, balance: Amount): void {
  Storage.set_data(_balKey(address), balance.value().toString());
}

/**
 * Internal function that gets a balance for an address
 *
 * @param {Address} address - address to get the balance for
 *
 * @return {Amount} the balance
 */
function _getBalance(address: Address): Amount {
  const bal = Storage.get_data_or_default(_balKey(address), '0');
  return new Amount(U64.parseInt(bal, 10));
}

/**
 * Internal function that sets an amount of allowance of a spender by an owner.
 *
 * @param {Address} ownerAddress - owner address
 * @param {Address} spenderAddress - spender address
 * @param {Amount} amount - amount to set an allowance for
 *
 */
function _approve(ownerAddress: Address, spenderAddress: Address, amount: Amount): void {
  Storage.set_data(_allowKey(ownerAddress, spenderAddress), amount.value().toString());
}

/**
 * Internal function that returns the allowance for an address
 *
 * @param {Address} ownerAddress - owner address
 * @param {Address} spenderAddress - spender address
 *
 * @return {Amount} the allowance
 */
function _allowance(ownerAddress: Address, spenderAddress: Address): Amount {
  const allow = Storage.get_data_or_default(_allowKey(ownerAddress, spenderAddress), '0');
  return new Amount(U64.parseInt(allow, 10));
}

/**
 * Constructs a key for searching a balance entry in storage
 *
 * @param {Address} address - address
 *
 * @return {string} key to be used for storage hash.
 */
function _balKey(address: Address): string {
  return Erc20.BALANCE_KEY_PRAEFIX.concat(address.value());
}

/**
 * Constructs a key for searching an allowance entry in storage
 *
 * @param {Address} ownerAddress - owner address
 * @param {Address} spenderAddress - spender address
 *
 * @return {string} key to be used for storage hash.
 */
function _allowKey(ownerAddress: Address, spenderAddress: Address): string {
  return Erc20.ALLOWANCE_KEY_PRAEFIX.concat(ownerAddress.value()).concat(spenderAddress.value());
}
