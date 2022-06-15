/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable max-len */
import {Storage, Context, generate_event} from 'massa-sc-std';
import {SetAllowanceArgs} from './args';
import {Amount} from 'mscl-type/assembly/amount';
import {Address} from 'mscl-type/assembly/address';

export const BALANCE_KEY_PRAEFIX = 'BALANCE_';
export const ALLOWANCE_KEY_PRAEFIX = 'ALLOW_';
export const TRANSFER_EVENT_NAME = 'TRANSFER';
export const APPROVAL_EVENT_NAME = 'APPROVAL';

/**
 * Constructs an event given a key and arguments
 *
 * @param {string} key - event key
 * @param {Array} args - array of string arguments.
 * @return {string} stringified event.
 */
function createEvent(key: string, args: Array<string>): string {
  return `${key}:`.concat(args.join(','));
}

// ==================================================== //
// ====================BASIC METHODS=================== //
// ==================================================== //

/**
 * Returns the name of the token.
 *
 * @return {string} token name.
 */
export function name(): string {
  return 'Massa ERC20 token';
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
  const deserializedAddress = Address.deserializeFromStr(args);
  assert(deserializedAddress && deserializedAddress.isValid(), 'Bad address format');
  const balance: Amount = _getBalance(<Address>deserializedAddress);
  return <string>balance.serializeToString();
}

// ==================================================== //
// ==================== ALLOWANCE ===================== //
// ==================================================== //

/**
 * Sets the allowance of a given address.
 *
 * @param {string} args - serialized class instance of type SetAllowanceArgs
 *
 * @return {boolean} true on success
 */
export function approve(args: string): boolean {
  const parsedArgs = SetAllowanceArgs.deserializeFromStr(args);
  _approve(parsedArgs.owner(), parsedArgs.spender(), parsedArgs.amount());
  return true;
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
  return BALANCE_KEY_PRAEFIX.concat(address.value());
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
  return ALLOWANCE_KEY_PRAEFIX.concat(ownerAddress.value()).concat(spenderAddress.value());
}
