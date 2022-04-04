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
  origine: string;

  /**
   * Builds a ERC20 wrapper
   *
   * @param {string} o - Origine address of the ERC20 smart contract.
   */
  constructor(o: string) {
    this.origine = o;
  }

  /**
   * Returns the token name.
   *
   * @return {string} - name of the token.
   */
  name(): string {
    return call(this.origine, 'name', 'i', 0);
  }

  /**
   * Returns the address balance.
   *
   * @param {string} a - Address to get balance from.
   * @return {u64} - Value of the balance.
   */
  balanceOf(a: string): u64 {
    return u64(parseInt(call(this.origine, 'balanceOf', a, 0), 10));
  }
}
