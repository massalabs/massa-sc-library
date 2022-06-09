import {call} from 'massa-sc-std';

/**
 * An ERC20 token wrapper.
 *
 * This class can be used to wrap an ERC20 to simplify caller job.
 *
 * ```assemblyscript
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
   * @param {string} baseAddress - Base address of the ERC20 smart contract.
   */
  constructor(baseAddress: string) {
    this.baseAddress = baseAddress;
  }

  /**
   * Returns the token name.
   *
   * @return {string} - name of the token.
   */
  name(): string {
    return call(this.baseAddress, 'name', '', 0);
  }

  /**
   * Returns the address balance.
   *
   * @param {string} address - Address to get balance from.
   * @return {string} - Value of the balance.
   */
  balanceOf(address: string): string {
    return u64(parseInt(call(this.baseAddress, 'balanceOf', address, 0), 10));
  }
}
