import {call} from 'massa-sc-std';

/**
 * An ERC20 token wrapper.
 *
 * This class can be used to wrap an ERC20 to simplify caller job.
 *
 * ```assembyscript
 *  ...
 *  const coin = new TokenWrapper(sc_address);
 *  let coin_name = coin.Name();
 *  let bal = coin.BalanceOf(my_address);
 *  print("balance: " + bal.toString() + " of token: " + coin_name);
 * ...
 * ```
 */
export class Wrapper {
  baseAddress: string;

  /**
   * Builds a ERC20 wrapper
   *
   * @param {string} o - Base address of the ERC20 smart contract.
   */
  constructor(o: string) {
    this.baseAddress = o;
  }

  /**
   * Returns the token name.
   *
   * @return {string} - name of the token.
   */
  name(): string {
    return call(this.baseAddress, 'name', 'i', 0);
  }

  /**
   * Returns the address balance.
   *
   * @param {string} a - Address to get balance from.
   * @return {u64} - Value of the balance.
   */
  balanceOf(a: string): u64 {
    return u64(parseInt(call(this.baseAddress, 'balanceOf', a, 0), 10));
  }
}
