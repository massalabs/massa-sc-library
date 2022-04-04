import {Storage} from 'massa-sc-std';

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
 * Returns the number of decimals of the token.
 *
 * Balance amout being a decimal number, this function returns
 * the maximal size (number of digits) of the fractional part (digits
 * after the decimal separator, in general `.`) of the amout.
 *
 * @return {u8} number of decimals.
 */
export function decimals(): u8 {
  return 6;
}

/**
 * Returns the total supply of token.
 *
 * Number of coins that were initially minted.
 *
 * @return {u64} number of minted token.
 */
export function totalSupply(): u64 {
  return 10000;
}

/**
 * Returns the balance of given address.
 *
 * @param {string} a - address
 *
 * @return {u64} amout linked to address.
 */
export function balanceOf(a: string): string {
  return Storage.get_data_or_default('bal'.concat(a), '0');
}
