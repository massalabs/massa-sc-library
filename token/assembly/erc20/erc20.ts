/* eslint-disable camelcase */
/* eslint-disable max-len */
import {Storage, Context, generate_event} from 'massa-sc-std';
import {GetAllowanceArgs,
  SetAllowanceArgs,
  IncreaseAllowanceArgs,
  DecreaseAllowanceArgs,
  MintArgs,
  TransferArgs,
  TransferFromArgs} from './json';
import {JSON} from 'json-as';

const NAME_KEY = 'NAME';
const SYMBOL_KEY = 'SYMBOL';
const DECIMALS_KEY = 'DECIMALS';
const TOTAL_SUPPLY = 'TOTAL_SUPPLY';
const BALANCE_KEY_PRAEFIX = 'BALANCE_';
const ALLOWANCE_KEY_PRAEFIX = 'ALLOW_';
const TRANSFER_EVENT_NAME = 'TRANSFER';
const APPROVAL_EVENT_NAME = 'APPROVAL';

/**
 * Constructs an event given a key and arguments
 *
 * @param {string} key - event key
 * @param {Array} args - array of string arguments
 * @return {string} stringified event.
 */
function constructEvent(key: string, ...args: Array<string>): string {
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
  return Storage.get_data(NAME_KEY);
}

/** Returns the symbol of the token.
 *
 * @return {string} token symbol.
 */
export function symbol(): string {
  return Storage.get_data(SYMBOL_KEY);
}

/**
 * Returns the number of decimals of the token.
 *
 * Balance amount being a decimal number, this function returns
 * the maximal size (number of digits) of the fractional part (digits
 * after the decimal separator, in general `.`) of the amount.
 *
 * @return {u8} number of decimals.
 */
export function decimals(): u8 {
  const decimals = Storage.get_data(DECIMALS_KEY);
  return u8(parseInt(decimals, 10));
}

/**
 * Returns the total token supply.
 *
 * Number of tokens that were initially minted.
 *
 * @return {u64} number of minted tokens.
 */
export function totalSupply(): u64 {
  const decimals = Storage.get_data(TOTAL_SUPPLY);
  return u64(parseInt(decimals, 10));
}

// ==================================================== //
// ==================== BALANCE ======================= //
// ==================================================== //

/**
 * Returns the balance of a given address.
 *
 * @param {string} address - Address to get balance for.
 *
 * @return {u64} balance amount for that address.
 */
export function balanceOf(address: string): u64 {
  const balance = _getBalance(address);
  return u64(parseInt(balance, 10));
}

// ==================================================== //
// ==================== ALLOWANCE ===================== //
// ==================================================== //

/**
 * Returns the allowance of a given address.
 *
 * @param {string} args - stringified JSON object of type GetAllowanceArgs
 *
 * @return {u64} remaining allowance amount linked to address.
 */
export function allowanceJSON(args: string): u64 {
  const parsedArgs: GetAllowanceArgs = JSON.parse<GetAllowanceArgs>(args);
  return allowance(parsedArgs.owner, parsedArgs.spender);
}

/**
 * Returns the allowance of a given address.
 *
 * @param {string} ownerAddress - owner address
 * @param {string} spenderAddress - spender address
 *
 * @return {u64} remaining allowance amount linked to address.
 */
export function allowance(ownerAddress: string, spenderAddress: string): u64 {
  const allowance = _allowance(ownerAddress, spenderAddress);
  return u64(parseInt(allowance, 10));
}

// ---------------------------------------------------- //
/**
 * Sets the allowance of a given address.
 *
 * @param {string} args - stringified JSON object of type SetAllowanceArgs
 *
 * @return {boolean} true on success
 */
export function approveJSON(args: string): boolean {
  const parsedArgs: SetAllowanceArgs = JSON.parse<SetAllowanceArgs>(args);
  return approve(parsedArgs.spender, parsedArgs.amount);
}

/**
 * Sets the allowance of a given address.
 *
 * @param {string} spenderAddress - spender address
 * @param {u64} amount - amount to set an allowance for
 *
 * @return {boolean} true on success
 */
export function approve(spenderAddress: string, amount: u64): boolean {
  const addresses = Context.get_call_stack();
  const ownerAddress = addresses[0];
  _approve(ownerAddress, spenderAddress, amount.toString());
  generate_event(constructEvent(APPROVAL_EVENT_NAME, ownerAddress, spenderAddress, amount.toString()));
  return true;
}

// ==================================================== //

/**
 * Increases the allowance of a given spender address.
 *
 * @param {string} args - stringified JSON object of type IncreaseAllowanceArgs
 *
 * @return {boolean} true on success
 */
export function increaseAllowanceJSON(args: string): boolean {
  const parsedArgs: IncreaseAllowanceArgs = JSON.parse<IncreaseAllowanceArgs>(args);
  return increaseAllowance(parsedArgs.spender, parsedArgs.addedAmount);
}

/**
 * Increases the allowance of a given spender address.
 *
 * @param {string} spenderAddress - spender address
 * @param {string} addedAmount - amount to increase the allowance with
 *
 * @return {boolean} true on success
 */
export function increaseAllowance(spenderAddress: string, addedAmount: u64): boolean {
  const addresses = Context.get_call_stack();
  const ownerAddress = addresses[0];
  const currentAllowance = u64(parseInt(_allowance(ownerAddress, spenderAddress), 10));
  const newAllowance = currentAllowance + addedAmount;
  _approve(ownerAddress, spenderAddress, newAllowance.toString());
  return true;
}

// ==================================================== //

/**
 * Decreases the allowance of a given spender address.
 *
 * @param {string} args - stringified JSON object of type DecreaseAllowanceArgs
 *
 * @return {boolean} true on success
 */
export function decreaseAllowanceJSON(args: string): boolean {
  const parsedArgs: DecreaseAllowanceArgs = JSON.parse<DecreaseAllowanceArgs>(args);
  return decreaseAllowance(parsedArgs.spender, parsedArgs.subtractedAmount);
}

/**
 * Decreases the allowance of a given spender address.
 *
 * @param {string} spenderAddress - spender address
 * @param {string} subtractedAmount - amount to decrease the allowance with
 *
 * @return {boolean} true on success
 */
export function decreaseAllowance(spenderAddress: string, subtractedAmount: u64): boolean {
  const addresses = Context.get_call_stack();
  const ownerAddress = addresses[0];
  const currentAllowance = u64(parseInt(_allowance(ownerAddress, spenderAddress), 10));
  assert(currentAllowance > subtractedAmount, 'Decreased allowance below zero');
  const newAllowance = currentAllowance - subtractedAmount;
  _approve(ownerAddress, spenderAddress, newAllowance.toString());
  return true;
}

// ==================================================== //
// ====================== MINTING ===================== //
// ==================================================== //

/**
 * Function to allow anyone to mint tokens.
 *
 * @param {string} args - stringified JSON object of type MintArgs
 * @return {void} void
 *
 */
export function mintJSON(args: string): void {
  const parsedArgs: MintArgs = JSON.parse<MintArgs>(args);
  return mint(parsedArgs.address, parsedArgs.amount);
}

/**
 * Function to allow anyone to mint tokens.
 *
 * @param {string} address - spender address
 * @param {u64} amount - amount to set an allowance for
 * @return {void} void
 */
export function mint(address: string, amount: u64): void {
  let supply = totalSupply();
  supply += amount;
  Storage.set_data(TOTAL_SUPPLY, supply.toString());
  let bal = balanceOf(address);
  bal += amount;
  _setBalance(address, bal.toString());
  generate_event(constructEvent(TRANSFER_EVENT_NAME, address, amount.toString()));
}

// ==================================================== //
// ====================== TRANSFER ==================== //
// ==================================================== //

/**
 * Function to transfer ownership of one token to another
 *
 * @param {string} args - stringified JSON object of type TransferArgs
 *
 * @return {boolean} true on success
 */
export function transferJSON(args: string): boolean {
  const parsedArgs: TransferArgs = JSON.parse<TransferArgs>(args);
  return transfer(parsedArgs.to, parsedArgs.amount);
}

/**
 * Function to transfer ownership of one token to another
 *
 * @param {string} to - receiver address
 * @param {u64} amount - amount of tokens to transfer to the new owner
 *
 * @return {boolean} true on success
 */
export function transfer(to: string, amount: u64): boolean {
  const addresses = Context.get_call_stack();
  const sender = addresses[0];
  generate_event(constructEvent(TRANSFER_EVENT_NAME, sender, to, amount.toString()));
  return true;
}

// ==================================================== //

/**
 * Function to transfer ownership of one token to another
 *
 * @param {string} args - stringified JSON object of type TransferFromArgs
 *
 * @return {boolean} true on success
 */
export function transferFromJSON(args: string): boolean {
  const parsedArgs: TransferFromArgs = JSON.parse<TransferFromArgs>(args);
  return transferFrom(parsedArgs.from, parsedArgs.to, parsedArgs.amount);
}

/**
 * Function to transfer ownership of one token to another
 *
 * @param {string} from - sender address
 * @param {string} to - receiver address
 * @param {u64} amount - amount of tokens to transfer to the receiver
 *
 * @return {boolean} true on success
 */
export function transferFrom(from: string, to: string, amount: u64): boolean {
  const addresses = Context.get_call_stack();
  const spender = addresses[0];
  const currentAllowance = u64(parseInt(_allowance(from, spender), 10));
  assert(currentAllowance >= amount, 'Insufficient allowance');
  _transfer(from, to, amount);
  const newAllowance = currentAllowance - amount;
  _approve(from, spender, newAllowance.toString());
  generate_event(constructEvent(TRANSFER_EVENT_NAME, from, to, amount.toString()));
  return true;
}

// ==================================================== //
// ================ INTERNAL FUNCTIONS ================ //
// ==================================================== //

/**
 * Internal function that sets a balance to an address
 *
 * @param {string} from - sender address
 * @param {string} to - receiver address
 * @param {u64} amount - amount to transfer
 *
 */
function _transfer(from: string, to: string, amount: u64): void {
  let fromBalance = balanceOf(from);
  assert(fromBalance > amount, 'Transfer amount exceeds balance');
  let toBalance = balanceOf(to);
  fromBalance -= amount;
  _setBalance(from, fromBalance.toString());
  toBalance += amount;
  _setBalance(to, toBalance.toString());
}

/**
 * Internal function that sets a balance to an address
 *
 * @param {string} address - address to set the balance for
 * @param {string} balance - balance to set
 *
 */
function _setBalance(address: string, balance: string): void {
  Storage.set_data(_balKey(address), balance);
}


/**
 * Internal function that gets a balance for an address
 *
 * @param {string} address - address to get the balance for
 *
 * @return {string} the balance
 */
function _getBalance(address: string): string {
  return Storage.get_data_or_default(_balKey(address), '0');
}

/**
 * Internal function that sets an amount of allowance of a spender by an owner.
 *
 * @param {string} ownerAddress - owner address
 * @param {string} spenderAddress - spender address
 * @param {string} amount - amount to set an allowance for
 *
 */
function _approve(ownerAddress: string, spenderAddress: string, amount: string): void {
  Storage.set_data(_allowKey(ownerAddress, spenderAddress), amount);
}

/**
 * Internal function that returns the allowance for an address
 *
 * @param {string} ownerAddress - owner address
 * @param {string} spenderAddress - spender address
 *
 * @return {string} the allowance
 */
function _allowance(ownerAddress: string, spenderAddress: string): string {
  return Storage.get_data_or_default(_allowKey(ownerAddress, spenderAddress), '0');
}

/**
 * Constructs a key for searching a balance entry in storage
 *
 * @param {string} address - address
 *
 * @return {string} key to be used for storage hash.
 */
function _balKey(address: string): string {
  return BALANCE_KEY_PRAEFIX.concat(address);
}

/**
 * Constructs a key for searching an allowance entry in storage
 *
 * @param {string} ownerAddress - owner address
 * @param {string} spenderAddress - spender address
 *
 * @return {string} key to be used for storage hash.
 */
function _allowKey(ownerAddress: string, spenderAddress: string): string {
  return ALLOWANCE_KEY_PRAEFIX.concat(ownerAddress).concat(spenderAddress);
}
