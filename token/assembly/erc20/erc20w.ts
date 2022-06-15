/* eslint-disable max-len */
import {call} from 'massa-sc-std';
import {SetAllowanceArgs} from './json';
import {Amount} from 'mscl-type/assembly/amount';
import {Address} from 'mscl-type/assembly/address';

const mapToBool = (val: string): boolean => {
  if (val.toLowerCase() === 'true') return true;
  return false;
};

/**
 * An ERC20 token wrapper.
 *
 * This class can be used to wrap an ERC20 to simplify caller job.
 *
 * ```assemblyscript
 *  ...
 *  const coin = new TokenWrapper(sc_address);
 *  let coin_name = coin.name();
 *  let bal = coin.balanceOf(my_address);
 *  print("balance: " + bal.toString() + " of token: " + coin_name);
 * ...
 * ```
 */
export class Wrapper {
  private baseAddress: string;

  /**
   * Builds a ERC20 wrapper
   *
   * @param {string} baseAddress - Base address of the ERC20 smart contract.
   */
  constructor(baseAddress: string) {
    this.baseAddress = baseAddress;
  }

  /**
   * Returns the base address of the ERC20 contract
   *
   * @return {string} baseAddress - Base address of the ERC20 smart contract.
   */
  address(): string {
    return this.baseAddress;
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
   * Returns the token symbol.
   *
   * @return {string} - symbol of the token.
   */
  symbol(): string {
    return call(this.baseAddress, 'symbol', '', 0);
  }

  /**
   * Returns the token total supply.
   *
   * @return {Amount} - number of minted tokens.
   */
  totalSupply(): Amount {
    const data: string = call(this.baseAddress, 'totalSupply', '', 0);
    const amount = U64.parseInt(data, 10);
    return new Amount(amount);
  }

  /**
   * Returns the address balance.
   *
   * @param {Address} address - Address to get balance for.
   * @return {Amount} - Value of the balance.
   */
  balanceOf(address: Address): Amount {
    assert(address.isValid(), 'Bad address format');
    const data: string = call(this.baseAddress, 'balanceOf', <string>address.serializeToString(), 0);
    const amount = Amount.deserializeFromStr(data);
    return <Amount>amount;
  }

  /**
 * Sets the allowance of a given address.
 *
 * @param {Address} ownerAddress - owner address
 * @param {Address} spenderAddress - spender address
 * @param {Amount} approvalAmount - amount to set an allowance for
 *
 * @return {boolean} true on success
 */
  approve(ownerAddress: Address, spenderAddress: Address, approvalAmount: Amount): boolean {
    assert(ownerAddress.isValid(), 'Bad owner address format');
    assert(spenderAddress.isValid(), 'Bad spender address format');
    assert(approvalAmount.isValid(), 'Bad approval amount format');
    const args = new SetAllowanceArgs(ownerAddress, spenderAddress, approvalAmount);
    return mapToBool(call(this.baseAddress, 'approveJSON', <string>args.serializeToString(), 0));
  }
}
